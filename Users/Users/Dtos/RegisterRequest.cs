using System.ComponentModel.DataAnnotations;
using Users.Models;

namespace Users.Dtos
{
    public class RegisterRequest
    {
        [Required, MaxLength(50)]
        public string Username { get; set; } = "";

        [Required, EmailAddress, MaxLength(254)]
        public string Email { get; set; } = "";

        [Required, MinLength(8), MaxLength(200)]
        public string Password { get; set; } = "";

        [Required]
        public UserRole Role { get; set; }
    }
}
