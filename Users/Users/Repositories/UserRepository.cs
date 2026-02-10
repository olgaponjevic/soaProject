using Microsoft.EntityFrameworkCore;
using Users.Data;
using Users.Models;

namespace Users.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _db;
        public UserRepository(AppDbContext db) => _db = db;

        public Task<bool> UsernameExistsAsync(string username) =>
            _db.Users.AnyAsync(u => u.Username == username);

        public Task<bool> EmailExistsAsync(string email) =>
            _db.Users.AnyAsync(u => u.Email == email);

        public Task<User?> GetByIdAsync(long id) =>
            _db.Users.FirstOrDefaultAsync(u => u.Id == id);

        public Task<User?> GetByUsernameAsync(string username) =>
            _db.Users.FirstOrDefaultAsync(u => u.Username == username);

        public async Task AddAsync(User user) => await _db.Users.AddAsync(user);

        public Task SaveChangesAsync() => _db.SaveChangesAsync();
    }
}
