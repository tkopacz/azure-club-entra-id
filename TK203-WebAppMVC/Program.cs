using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.UI;
using Microsoft.IdentityModel.Logging;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

//----------------
//Use OpenID Connect to sign in users with the Microsoft identity platform
//----------------
builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApp(builder.Configuration.GetSection("AzureAd"));
// Properly configure the cookie auth scheme ("Cookies") for AccessDenied redirection
builder.Services.Configure<CookieAuthenticationOptions>(CookieAuthenticationDefaults.AuthenticationScheme, options =>
{
    options.AccessDeniedPath = "/Home/AccessDenied"; // custom page
});
// Add authorization with role-based policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Role1Policy", policy => policy.RequireRole("role1"));
    options.AddPolicy("Role2Policy", policy => policy.RequireRole("role2"));
});
builder.Services.AddControllersWithViews()
    .AddMicrosoftIdentityUI();
// Microsoft.Identity.Web UI uses Razor Pages for some endpoints (e.g., AccessDenied) so map them
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.MapRazorPages(); // ensure area pages (MicrosoftIdentity) are available if still used

IdentityModelEventSource.ShowPII = true;
IdentityModelEventSource.LogCompleteSecurityArtifact = true;
app.Run();
