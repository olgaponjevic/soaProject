using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Users.Dtos;
using Users.Services;

namespace Users.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;
        public UsersController(IUserService service) => _service = service;

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<ProfileResponse>> Register(RegisterRequest request)
        {
            try
            {
                var created = await _service.RegisterAsync(request);
                return CreatedAtAction(nameof(Me), new { }, created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<ProfileResponse>> Me()
        {
            var userId = GetUserIdOrThrow();
            return Ok(await _service.GetProfileAsync(userId));
        }

        [HttpPut("me")]
        [Authorize]
        public async Task<ActionResult<ProfileResponse>> UpdateMe(UpdateProfileRequest request)
        {
            var userId = GetUserIdOrThrow();
            return Ok(await _service.UpdateProfileAsync(userId, request));
        }

        private long GetUserIdOrThrow()
        {
            var idStr =
                User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                User.FindFirstValue("sub");

            if (!long.TryParse(idStr, out var userId))
                throw new UnauthorizedAccessException("Invalid user id in token.");

            return userId;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
        {
            try
            {
                var token = await _service.LoginAsync(request.Username, request.Password);
                return Ok(new LoginResponse { Token = token });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
        }
    }
}
