using Users.Dtos;

namespace Users.Services
{
    public interface IUserService
    {
        Task<ProfileResponse> RegisterAsync(RegisterRequest request);
        Task<ProfileResponse> GetProfileAsync(long userId);
        Task<ProfileResponse> UpdateProfileAsync(long userId, UpdateProfileRequest request);
        Task<string> LoginAsync(string username, string password);
    }
}
