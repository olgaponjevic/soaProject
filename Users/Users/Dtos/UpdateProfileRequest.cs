using System.ComponentModel.DataAnnotations;

namespace Users.Dtos
{
    public class UpdateProfileRequest
    {
        [MaxLength(80)] public string? FirstName { get; set; }
        [MaxLength(80)] public string? LastName { get; set; }
        public string? ProfileImageUrl { get; set; }
        [MaxLength(2000)] public string? Biography { get; set; }
        [MaxLength(200)] public string? Motto { get; set; }
    }
}
