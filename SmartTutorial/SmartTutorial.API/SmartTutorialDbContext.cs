using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SmartTutorial.Domain;
using SmartTutorial.Domain.Auth;
using SmartTutorial.EFMapping;
using SmartTutorial.EFMapping.Schemas;

namespace SmartTutorial.API
{
    public sealed class
        SmartTutorialDbContext : IdentityDbContext<User, Role, int, UserClaim, UserRole, UserLogin, RoleClaim,
            UserToken>
    {
        public SmartTutorialDbContext(DbContextOptions<SmartTutorialDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Course> Courses { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Option> Options { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            var assembly = typeof(SubjectConfig).Assembly;
            builder.ApplyConfigurationsFromAssembly(assembly);
            ApplyIdentityMapConfiguration(builder);
        }

        private void ApplyIdentityMapConfiguration(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("Users", SchemaConst.Auth);
            modelBuilder.Entity<UserClaim>().ToTable("UserClaims", SchemaConst.Auth);
            modelBuilder.Entity<UserLogin>().ToTable("UserLogins", SchemaConst.Auth);
            modelBuilder.Entity<UserToken>().ToTable("UserRoles", SchemaConst.Auth);
            modelBuilder.Entity<Role>().ToTable("Roles", SchemaConst.Auth);
            modelBuilder.Entity<RoleClaim>().ToTable("RoleClaims", SchemaConst.Auth);
            modelBuilder.Entity<UserRole>().ToTable("UserRole", SchemaConst.Auth);
        }
    }
}