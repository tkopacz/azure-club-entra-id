using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.JsonWebTokens; // handle JsonWebToken
using Microsoft.IdentityModel.Logging;
using net_api;
using NSwag.AspNetCore;
using System.IdentityModel.Tokens.Jwt; // added for JwtSecurityToken
using System.Security.Claims;
using System.Text; // for Base64Url decoding
using System.Text.Json; // added for JSON serialization
using System.Text.Json.Serialization;


var builder = WebApplication.CreateSlimBuilder(args);

var azureAdSection = builder.Configuration.GetSection("AzureAd");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"))
    ;

builder.Services.Configure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
{
    var audience = builder.Configuration["AzureAd:Audience"]; var clientId = builder.Configuration["AzureAd:ClientId"];
    options.TokenValidationParameters.ValidAudiences = new[] { audience, clientId };
    options.TokenValidationParameters.RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    options.TokenValidationParameters.NameClaimType = "preferred_username";
    options.TokenValidationParameters.RoleClaimType = "roles";
    // Decode JWT & output to debug (development only)
    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = context =>
        {
            var env = context.HttpContext.RequestServices.GetRequiredService<IHostEnvironment>();
            if (!env.IsDevelopment())
                return Task.CompletedTask; // only log in Development

            var logger = context.HttpContext.RequestServices
                .GetRequiredService<ILoggerFactory>()
                .CreateLogger("JwtDecoder");

            string? headerJson = null;
            string? payloadJson = null;

            switch (context.SecurityToken)
            {
                case JwtSecurityToken jwt: // classic handler
                    headerJson = JsonSerializer.Serialize(jwt.Header, new JsonSerializerOptions { WriteIndented = true });
                    payloadJson = JsonSerializer.Serialize(jwt.Payload, new JsonSerializerOptions { WriteIndented = true });
                    break;
                case JsonWebToken jtoken: // new default lightweight handler
                    // Use encoded token pieces to avoid reflection; jtoken.EncodedToken is full token
                    var parts = jtoken.EncodedToken?.Split('.') ?? Array.Empty<string>();
                    if (parts.Length >= 2)
                    {
                        headerJson = PrettyJson(Base64UrlDecode(parts[0]));
                        payloadJson = PrettyJson(Base64UrlDecode(parts[1]));
                    }
                    else
                    {
                        // Fallback building minimal payload
                        payloadJson = JsonSerializer.Serialize(jtoken.Claims.ToDictionary(c => c.Type, c => c.Value), new JsonSerializerOptions { WriteIndented = true });
                    }
                    break;
            }

            if (headerJson != null && payloadJson != null)
                logger.LogDebug("JWT decoded. Header: {Header}\nPayload: {Payload}", headerJson, payloadJson);
            else
                logger.LogDebug("JWT decoded but could not serialize header/payload for token type {Type}", context.SecurityToken.GetType().Name);

            return Task.CompletedTask;

            static string Base64UrlDecode(string segment)
            {
                string s = segment.Replace('-', '+').Replace('_', '/');
                switch (s.Length % 4)
                {
                    case 2: s += "=="; break;
                    case 3: s += "="; break;
                }
                var bytes = Convert.FromBase64String(s);
                return Encoding.UTF8.GetString(bytes);
            }

            static string PrettyJson(string raw)
            {
                try
                {
                    using var doc = JsonDocument.Parse(raw);
                    return JsonSerializer.Serialize(doc.RootElement, new JsonSerializerOptions { WriteIndented = true });
                }
                catch { return raw; }
            }
        }
    };
});

// Authorization policies per calculator operation scope
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("custom-role2", p => p.RequireAssertion(ctx => Util.HasRole(ctx.User, "role2")));
    //options.AddPolicy("custom-role2", p => p.RequireAssertion(ctx => ctx.User.IsInRole("role2")));
    options.AddPolicy("Calculator.Add", p => p.RequireAssertion(ctx => Util.HasScope(ctx.User, "Calculator.Add")));
    options.AddPolicy("Calculator.Subtract", p => p.RequireAssertion(ctx => Util.HasScope(ctx.User, "Calculator.Subtract")));
    options.AddPolicy("Calculator.Multiply", p => p.RequireAssertion(ctx => Util.HasScope(ctx.User, "Calculator.Multiply")));

});


builder.Services.AddControllers();
builder.Services.AddHttpClient();

// CORS: allow the frontend (adjust origin(s) as needed)
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173"      // Vite / SPA dev server
                                             //"*"
            )
            .AllowAnyMethod().AllowAnyHeader().AllowCredentials(); // Needed if sending auth cookies or Authorization header
    });
});

// NSwag: add OpenAPI document generation
builder.Services.AddOpenApiDocument(settings =>
{
    settings.Title = "Calculator & Todos API";
    settings.Version = "v1";
    var apiAppId = builder.Configuration["AzureAd:ClientId"];
    settings.AddSecurity("oauth2", new NSwag.OpenApiSecurityScheme
    {
        Type = NSwag.OpenApiSecuritySchemeType.OAuth2,
        // NSwag uses flows; use AuthorizationCode semantics via AuthorizationCode OAuth2 type (set below via explicit object)
        Flows = new NSwag.OpenApiOAuthFlows
        {
            AuthorizationCode = new NSwag.OpenApiOAuthFlow
            {
                AuthorizationUrl = builder.Configuration["Swagger:AuthorizationUrl"],
                TokenUrl = builder.Configuration["Swagger:TokenUrl"],
                Scopes = new Dictionary<string, string>
                {
                    { $"api://{apiAppId}/Calculator.Add", "Add numbers" },
                    { $"api://{apiAppId}/Calculator.Subtract", "Subtract numbers" },
                    { $"api://{apiAppId}/Calculator.Multiply", "Multiply numbers" },
                }
            }
        }
    });
    settings.OperationProcessors.Add(new NSwag.Generation.Processors.Security.AspNetCoreOperationSecurityScopeProcessor("oauth2"));
});

var app = builder.Build();

//app.UseHttpsRedirection();

app.UseCors("Frontend");

if (app.Environment.IsDevelopment())
{
    // Generate the OpenAPI specification and serve Swagger UI
    app.UseOpenApi(); // Serves /swagger/v1/swagger.json
    app.UseSwaggerUi(settings =>
    {
        settings.DocumentTitle = "Calculator & Todos API";
        settings.Path = "/swagger"; // UI at /swagger
        settings.OAuth2Client = new NSwag.AspNetCore.OAuth2ClientSettings
        {
            ClientId = app.Configuration["Swagger:ClientId"],
            AppName = "Calculator & Todos API Swagger",
            UsePkceWithAuthorizationCodeGrant = true,
            Scopes = {
                "api://c6610121-03c0-45b8-bbc1-2c51561dacea/Calculator.Multiply",
                "api://c6610121-03c0-45b8-bbc1-2c51561dacea/Calculator.Subtract",
                "api://c6610121-03c0-45b8-bbc1-2c51561dacea/Calculator.Add"
            }
        };
    });
}


app.UseAuthentication();
app.UseAuthorization();

var sampleTodos = new Todo[] {
    new(1, "Walk the dog"),
    new(2, "Do the dishes", DateOnly.FromDateTime(DateTime.Now)),
    new(3, "Do the laundry", DateOnly.FromDateTime(DateTime.Now.AddDays(1))),
    new(4, "Clean the bathroom"),
    new(5, "Clean the car", DateOnly.FromDateTime(DateTime.Now.AddDays(2)))
};

var todosApi = app.MapGroup("/todos");
// Todos are open (no authorization required)
// If you later want optional auth, you can add .RequireAuthorization() or specific policies.

todosApi.MapGet("/", () => sampleTodos);

todosApi.MapGet("/{id}", (int id) =>
    sampleTodos.FirstOrDefault(a => a.Id == id) is { } todo
        ? Results.Ok(todo)
        : Results.NotFound());

app.MapControllers();

IdentityModelEventSource.ShowPII = true;
IdentityModelEventSource.LogCompleteSecurityArtifact = true;
app.Run();

public record Todo(int Id, string? Title, DateOnly? DueBy = null, bool IsComplete = false);

