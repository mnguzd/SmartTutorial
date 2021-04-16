using SmartTutorial.Domain;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartTutorial.API
{
    public class Seed
    {
        public static async Task SeedSubjects(SmartTutorialDbContext context)
        {
            if (!context.Themes.Any())
            {
                context.Themes.Add(new Theme() { Name = "WEB",ImageUrl= "https://www.motocms.com/blog/wp-content/uploads/2018/01/web-desi-main.jpg",Description= "Go from no-code to an in-demand junior web developer, at a fraction of the cost of a bootcamp" });
                context.Themes.Add(new Theme() { Name = "Programming",ImageUrl= "https://theaceresearch.com/images/Survey_Program.jpg",Description= "The purpose of programming is to find a sequence of instructions that will automate the performance of a task" });
                context.Themes.Add(new Theme() { Name = "Computer science",ImageUrl= "https://www.eschoolnews.com/files/2016/12/computer-science-education.jpg",Description= "Computer science applies the principles of mathematics, engineering, and logic to a plethora of functions" });
                context.Themes.Add(new Theme() { Name = "Databases",ImageUrl= "https://nordicapis.com/wp-content/uploads/5-Great-Open-Source-Database-Solutions.png",Description= "A database is an organized collection of data, generally stored and accessed electronically from a computer system" });
                context.Themes.Add(new Theme() { Name = "Machine learning",ImageUrl= "https://thumbor.forbes.com/thumbor/fit-in/1200x0/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fdam%2Fimageserve%2F1129869424%2F0x0.jpg%3Ffit%3Dscale",Description= "Machine learning involves computers discovering how they can perform tasks without being explicitly programmed to do so" });
                context.Themes.Add(new Theme() { Name = "Mobile development",ImageUrl= "https://miro.medium.com/max/7875/1*JUSbO0xkXPf2jtYLMSAZ8w.jpeg",Description= "Mobile app development is the act or process by which a mobile app is developed for mobile devices, such as personal digital assistants, enterprise digital assistants or mobile phones" });
                await context.SaveChangesAsync();
            }

            if (!context.Subjects.Any())
            {
                List<Subject> list = new List<Subject>() {
                 new Subject() { Complexity = 4, Name = "Asp.net" },
                new Subject() { Complexity = 3, Name = "Vue.js" }
            };
                List<Subject> an = new List<Subject>() {
             new Subject() { Complexity = 3, Name = "SQL" },
             new Subject() { Complexity = 3, Name = "Entity Framework" },
             new Subject() { Complexity = 3, Name = "Entity Framework Core" } };

                List<Subject> ano = new List<Subject>() {
             new Subject() { Complexity = 2, Name = "HTML" },
             new Subject() { Complexity = 4, Name = "C#" },
             new Subject() { Complexity = 2, Name = "CSS" },
             new Subject() { Complexity = 4, Name = "Javascript" },
             new Subject() { Complexity = 5, Name = "React" }};
                context.Themes.Find(1).Subjects = list;
                context.Themes.Find(4).Subjects = an;
                context.Themes.Find(2).Subjects = ano;
                await context.SaveChangesAsync();
            }

        }
        public static async Task SeedTopics(SmartTutorialDbContext context)
        {
            if (!context.Topics.Any())
            {
                List<Topic> aspTopics = new List<Topic>() {
                new Topic() { Name = "StartUp class", Text = "Sample" },
                new Topic(){Name = "Map and MapWhen",Text="Sample"},
                new Topic(){Name = "Middleware",Text="Sample"}
            };
                context.Subjects.Find(8).Topics = aspTopics;

                List<Topic> vueTopics = new List<Topic>() {
                new Topic() { Name = "Basics vue", Text = "Sample" },
                new Topic(){Name = "Refs and html",Text="Sample"},
                new Topic(){Name = "Lifesycle",Text="Sample"}
            };
                context.Subjects.Find(7).Topics = vueTopics;

                List<Topic> sqlTopics = new List<Topic>() {
                new Topic() { Name = "Basics sql", Text = "Sample" },
                new Topic(){Name = "Select and Where",Text="Sample"},
                new Topic(){Name = "Joins",Text="Sample"}
            };
                context.Subjects.Find(10).Topics = sqlTopics;

                await context.SaveChangesAsync();
            }
        }
    }
}
