using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace net_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CalculatorController : ControllerBase
{
    [Authorize(Policy = "Calculator.Add")]
    [HttpGet("add")] // /api/calculator/add?a=1&b=2
    public ActionResult<double> Add([FromQuery] double a, [FromQuery] double b) => a + b;

    [Authorize(Policy = "Calculator.Subtract")]
    [HttpGet("subtract")] // /api/calculator/subtract?a=5&b=3
    public ActionResult<double> Subtract([FromQuery] double a, [FromQuery] double b) => a - b;

    [Authorize(Policy = "Calculator.Multiply")]
    [HttpGet("multiply")] // /api/calculator/multiply?a=2&b=4
    public ActionResult<double> Multiply([FromQuery] double a, [FromQuery] double b) => a * b;
}
