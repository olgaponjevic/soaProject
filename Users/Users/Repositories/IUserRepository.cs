using Users.Models;

namespace Users.Repositories
{
    public interface IUserRepository
    {
        Task<bool> UsernameExistsAsync(string username);
        Task<bool> EmailExistsAsync(string email);
        Task<User?> GetByIdAsync(long id);
        Task<User?> GetByUsernameAsync(string username);

        Task AddAsync(User user);
        Task SaveChangesAsync();
    }
}
