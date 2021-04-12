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
            if (!context.Subjects.Any())
            {
                Subject asp = new Subject() { Complexity = 4, Name = "Asp.net" };
                Subject vue = new Subject() { Complexity = 3, Name = "Vue.js" };
                Subject sql = new Subject() { Complexity = 3, Name = "SQL" };
                Subject ef = new Subject() { Complexity = 3, Name = "Entity Framework" };
                Subject efCore = new Subject() { Complexity = 3, Name = "Entity Framework Core" };
                Subject html = new Subject() { Complexity = 2, Name = "HTML" };
                Subject cSharp = new Subject() { Complexity = 4, Name = "C#" };
                Subject css = new Subject() { Complexity = 2, Name = "CSS" };
                Subject javascript = new Subject() { Complexity = 4, Name = "Javascript" };
                Subject react = new Subject() { Complexity = 5, Name = "React" };
                context.Subjects.Add(asp);
                context.Subjects.Add(vue);
                context.Subjects.Add(sql);
                context.Subjects.Add(ef);
                context.Subjects.Add(efCore);
                context.Subjects.Add(html);
                context.Subjects.Add(cSharp);
                context.Subjects.Add(css);
                context.Subjects.Add(javascript);
                context.Subjects.Add(react);
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
                context.Subjects.Find(1).Topics = aspTopics;

                List<Topic> vueTopics = new List<Topic>() {
                new Topic() { Name = "Basics vue", Text = "Sample" },
                new Topic(){Name = "Refs and html",Text="Sample"},
                new Topic(){Name = "Lifesycle",Text="Sample"}
            };
                context.Subjects.Find(2).Topics = vueTopics;

                List<Topic> sqlTopics = new List<Topic>() {
                new Topic() { Name = "Basics sql", Text = "Sample" },
                new Topic(){Name = "Select and Where",Text="Sample"},
                new Topic(){Name = "Joins",Text="Sample"}
            };
                context.Subjects.Find(3).Topics = sqlTopics;

                await context.SaveChangesAsync();
            }
        }
    }
}
