using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using Microsoft.Identity.Web;

namespace OboDemo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MeController : ControllerBase
{
    private readonly GraphServiceClient _graphServiceClient;
    private readonly ITokenAcquisition _tokenAcquisition;
    private readonly ILogger<MeController> _logger;


    public MeController(GraphServiceClient graphServiceClient, ITokenAcquisition tokenAcquisition, ILogger<MeController> logger)
    {
        _graphServiceClient = graphServiceClient;
        _tokenAcquisition = tokenAcquisition;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetMeAsync(CancellationToken cancellationToken)
    {
        //Or give directly consent to API on Entra ID portal
        _logger.LogInformation("Received GET /api/me request");
        try
        {
            // Request additional scopes dynamically
            string[] scopes = new[] { "User.Read" };
            _logger?.LogInformation($"Requesting token for scopes: {string.Join(",", scopes)}");
            string accessToken = await _tokenAcquisition.GetAccessTokenForUserAsync(scopes);
            _logger?.LogInformation($"Access token: {accessToken.Substring(0, Math.Min(40, accessToken.Length))}...");

            // Use the token with GraphServiceClient
            var me = await _graphServiceClient.Me.Request()
                .Header("Authorization", $"Bearer {accessToken}")
                .GetAsync(cancellationToken: cancellationToken);

            return Ok(me);
        }
        catch (MicrosoftIdentityWebChallengeUserException ex)
        {
            _logger?.LogWarning($"Consent required: {ex.Message}");
            // Return 403 Forbidden with required scopes for dynamic consent
            return StatusCode(403, new
            {
                error = "consent_required",
                message = "Additional consent required for scopes: User.Read",
                requiredScopes = new[] { "User.Read" },
                details = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger?.LogError(ex, "Unhandled exception in GetMeAsync");
            return BadRequest(new { error = ex.Message });
        }
    }
}
