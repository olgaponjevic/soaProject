using Users.Models;

namespace Users.Services
{
    public interface IJwtTokenService
    {
        string CreateToken(User user);
    }
}
