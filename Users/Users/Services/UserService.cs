using Users.Dtos;
using Users.Models;
using Users.Repositories;

namespace Users.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;
        public UserService(IUserRepository repo) => _repo = repo;
        private readonly IJwtTokenService _jwt;
        public UserService(IUserRepository repo, IJwtTokenService jwt)
        {
            _repo = repo;
            _jwt = jwt;
        }

        public async Task<ProfileResponse> RegisterAsync(RegisterRequest request)
        {
            // Admini se ubacuju direktno u bazu -> zabranjeno kroz register
            if (request.Role == UserRole.Administrator)
                throw new InvalidOperationException("Administrator role cannot be selected during registration.");

            if (await _repo.UsernameExistsAsync(request.Username))
                throw new InvalidOperationException("Username already exists.");

            if (await _repo.EmailExistsAsync(request.Email))
                throw new InvalidOperationException("Email already exists.");

            var user = new User
            {
                Username = request.Username.Trim(),
                Email = request.Email.Trim().ToLowerInvariant(),
                Role = request.Role,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            };

            await _repo.AddAsync(user);
            await _repo.SaveChangesAsync();

            return MapProfile(user);
        }

        public async Task<ProfileResponse> GetProfileAsync(long userId)
        {
            var user = await _repo.GetByIdAsync(userId) ?? throw new KeyNotFoundException("User not found.");
            return MapProfile(user);
        }

        public async Task<ProfileResponse> UpdateProfileAsync(long userId, UpdateProfileRequest request)
        {
            var user = await _repo.GetByIdAsync(userId) ?? throw new KeyNotFoundException("User not found.");

            // patch update
            if (request.FirstName is not null) user.FirstName = request.FirstName;
            if (request.LastName is not null) user.LastName = request.LastName;
            if (request.ProfileImageUrl is not null) user.ProfileImageUrl = request.ProfileImageUrl;
            if (request.Biography is not null) user.Biography = request.Biography;
            if (request.Motto is not null) user.Motto = request.Motto;

            await _repo.SaveChangesAsync();
            return MapProfile(user);
        }

        private static ProfileResponse MapProfile(User u) => new()
        {
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            Role = u.Role,
            FirstName = u.FirstName,
            LastName = u.LastName,
            ProfileImageUrl = u.ProfileImageUrl,
            Biography = u.Biography,
            Motto = u.Motto
        };

        public async Task<string> LoginAsync(string username, string password)
        {
            var user = await _repo.GetByUsernameAsync(username.Trim())
                ?? throw new UnauthorizedAccessException("Invalid credentials.");

            if (user.IsBlocked)
                throw new UnauthorizedAccessException("Account is blocked.");

            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid credentials.");

            return _jwt.CreateToken(user);
        }
    }
}
