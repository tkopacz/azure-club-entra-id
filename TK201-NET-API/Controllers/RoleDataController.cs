using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace net_api.Controllers;


/*
 * A roles claim appears in an access token ONLY if:
The target resource (the API whose aud = …) defines at least one app role, AND
The signed-in user (or a group they’re in) is assigned at least one of those app roles (Enterprise App assignment), AND
You requested a token for that resource (its Application ID URI / client ID) — not some proxy/mistaken resource.
role2 in SPA client AND role2 in API assigned to user
 */

[ApiController]
[Route("api/[controller]")]
public class RoleDataController : ControllerBase
{
    // Accessible only to users in role1
    [HttpGet("role1")]
    [Authorize(Roles = "role1")] // expects 'roles' claim with value 'role1'
    public ActionResult<string> DataForRole1()
        => new JsonResult("Sensitive data for role1");

    // Accessible only to users in role2
    [HttpGet("role2")]
    [Authorize(Policy = "custom-role2")]
    //[Authorize(Roles = "role2")] // expects 'roles' claim with value 'role2'
    public ActionResult<string> DataForRole2()
        => new JsonResult("Sensitive data for role2");

    // Accessible only to users in role3
    [HttpGet("role3")]
    [Authorize(Roles = "role3")] // expects 'roles' claim with value 'role3'
    public ActionResult<string> DataForRole3()
        => new JsonResult("Sensitive data for role3");

}
