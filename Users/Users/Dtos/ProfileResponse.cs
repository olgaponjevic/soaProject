using Users.Models;

namespace Users.Dtos
{
    public class ProfileResponse
    {
        public long Id { get; set; }
        public string Username { get; set; } = "";
        public string Email { get; set; } = "";
        public UserRole Role { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string? Biography { get; set; }
        public string? Motto { get; set; }
    }
}
