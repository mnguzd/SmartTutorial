using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using SmartTutorial.Domain;
using SmartTutorial.Domain.Auth;

namespace SmartTutorial.API
{
    public static class Seed
    {
        public static async Task SeedSubjects(SmartTutorialDbContext context)
        {
            if (!context.Courses.Any())
            {
                context.Courses.Add(new Course
                {
                    Name = "WEB",
                    ImageUrl = "https://www.motocms.com/blog/wp-content/uploads/2018/01/web-desi-main.jpg",
                    Description =
                        "Go from no-code to an in-demand junior web developer, at a fraction of the cost of a bootcamp"
                });
                context.Courses.Add(new Course
                {
                    Name = "Programming", ImageUrl = "https://theaceresearch.com/images/Survey_Program.jpg",
                    Description =
                        "The purpose of programming is to find a sequence of instructions that will automate the performance of a task"
                });
                context.Courses.Add(new Course
                {
                    Name = "Computer science",
                    ImageUrl = "https://www.eschoolnews.com/files/2016/12/computer-science-education.jpg",
                    Description =
                        "Computer science applies the principles of mathematics, engineering, and logic to a plethora of functions"
                });
                context.Courses.Add(new Course
                {
                    Name = "Databases",
                    ImageUrl = "https://nordicapis.com/wp-content/uploads/5-Great-Open-Source-Database-Solutions.png",
                    Description =
                        "A database is an organized collection of data, generally stored and accessed electronically from a computer system"
                });
                context.Courses.Add(new Course
                {
                    Name = "Machine learning",
                    ImageUrl =
                        "https://thumbor.forbes.com/thumbor/fit-in/1200x0/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fdam%2Fimageserve%2F1129869424%2F0x0.jpg%3Ffit%3Dscale",
                    Description =
                        "Machine learning involves computers discovering how they can perform tasks without being explicitly programmed to do so"
                });
                context.Courses.Add(new Course
                {
                    Name = "Mobile development",
                    ImageUrl = "https://miro.medium.com/max/7875/1*JUSbO0xkXPf2jtYLMSAZ8w.jpeg",
                    Description =
                        "Mobile app development is the act or process by which a mobile app is developed for mobile devices, such as personal digital assistants, enterprise digital assistants or mobile phones"
                });
                await context.SaveChangesAsync();
            }

            if (!context.Subjects.Any())
            {
                var list = new List<Subject>
                {
                    new Subject {Complexity = 4, Name = "Asp.net"},
                    new Subject {Complexity = 3, Name = "Vue.js"}
                };
                var an = new List<Subject>
                {
                    new Subject {Complexity = 3, Name = "SQL"},
                    new Subject {Complexity = 3, Name = "Entity Framework"},
                    new Subject {Complexity = 3, Name = "Entity Framework Core"}
                };

                var ano = new List<Subject>
                {
                    new Subject {Complexity = 2, Name = "HTML"},
                    new Subject {Complexity = 4, Name = "C#"},
                    new Subject {Complexity = 2, Name = "CSS"},
                    new Subject {Complexity = 4, Name = "Javascript"},
                    new Subject {Complexity = 5, Name = "React"}
                };
                (await context.Courses.FindAsync(1)).Subjects = list;
                (await context.Courses.FindAsync(4)).Subjects = an;
                (await context.Courses.FindAsync(2)).Subjects = ano;
                await context.SaveChangesAsync();
            }
        }

        public static async Task SeedTopics(SmartTutorialDbContext context)
        {
            if (!context.Topics.Any())
            {
                var aspTopics = new List<Topic>
                {
                    new Topic {Name = "StartUp class", Content = "Content"},
                    new Topic {Name = "Map and MapWhen", Content = "Content"},
                    new Topic {Name = "Middleware", Content = "Content"}
                };
                (await context.Subjects.FindAsync(8)).Topics = aspTopics;

                var vueTopics = new List<Topic>
                {
                    new Topic {Name = "Basics vue", Content = "Content"},
                    new Topic {Name = "Refs and html", Content = "Content"},
                    new Topic {Name = "Lifesycle", Content = "Content"}
                };
                (await context.Subjects.FindAsync(7)).Topics = vueTopics;

                var sqlTopics = new List<Topic>
                {
                    new Topic {Name = "Basics sql", Content = "Content"},
                    new Topic {Name = "Select and Where", Content = "Content"},
                    new Topic {Name = "Joins", Content = "Content"}
                };
                (await context.Subjects.FindAsync(10)).Topics = sqlTopics;

                await context.SaveChangesAsync();
            }
        }

        public static async Task SeedAdmin(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            const string adminEmail = "mnguzd@gmail.com";
            const string adminUsername = "mnguzd";
            const string adminPassword = "MnGuZd1703";

            if (await roleManager.FindByNameAsync("Admin") == null)
            {
                var role = new Role
                {
                    Name = "Admin",
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                };
                await roleManager.CreateAsync(role);
            }

            if (await roleManager.FindByNameAsync("User") == null)
            {
                var role = new Role
                {
                    Name = "User",
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                };
                await roleManager.CreateAsync(role);
            }

            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                var admin = new User
                {
                    Email = adminEmail,
                    UserName = adminUsername,
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                var result = await userManager.CreateAsync(admin, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Admin");
                }
            }
        }
    }
}