﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SmartTutorial.Domain;
using SmartTutorial.Domain.Auth;
using SmartTutorial.EFMapping;

namespace SmartTutorial.API
{
    public class SmartTutorialDbContext : IdentityDbContext<User,Role,int>
    {
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }

        public SmartTutorialDbContext(DbContextOptions<SmartTutorialDbContext> options):base(options)
        {
         //   Database.EnsureDeleted();
        }
        
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            var assembly = typeof(SubjectConfig).Assembly;
            builder.ApplyConfigurationsFromAssembly(assembly);
        }
    }
}
