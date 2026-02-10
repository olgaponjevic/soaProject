using System.ComponentModel.DataAnnotations;

namespace Users.Models
{
    public class User
    {
        public long Id { get; set; }

        [Required, MaxLength(50)]
        public string Username { get; set; } = "";

        [Required, MaxLength(254)]
        public string Email { get; set; } = "";

        [Required]
        public string PasswordHash { get; set; } = "";

        public UserRole Role { get; set; } = UserRole.Tourist;

        public bool IsBlocked { get; set; } = false;

        [MaxLength(80)] public string? FirstName { get; set; }
        [MaxLength(80)] public string? LastName { get; set; }
        public string? ProfileImageUrl { get; set; }
        [MaxLength(2000)] public string? Biography { get; set; }
        [MaxLength(200)] public string? Motto { get; set; }

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
