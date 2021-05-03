using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SmartTutorial.API.Infrastucture.Extensions;
using SmartTutorial.API.Mapping;
using Newtonsoft.Json;
using Newtonsoft;
using SmartTutorial.API.Repositories.Implementations;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.API.Services.Implementations;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain.Auth;

namespace SmartTutorial.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<SmartTutorialDbContext>(optionBuilder => optionBuilder.UseLazyLoadingProxies().UseSqlServer(Configuration.GetConnectionString("SmartTutorialConnection")));
            services.AddIdentity<User, Role>(options =>
            {
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
            }).AddEntityFrameworkStores<SmartTutorialDbContext>();
            var authOptions = services.ConfigureAuthOptions(Configuration);
            services.AddJwtAuthentication(authOptions);
            services.AddControllers(
                options =>
                {
                    options.Filters.Add(new AuthorizeFilter());
                });
            services.AddScoped(typeof(IGenericRepository<>), typeof(EFCoreRepository<>));
            services.AddScoped<ISubjectService, SubjectService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IThemeService, ThemeService>();
            services.AddAutoMapper(typeof(MappingProfile));
            services.AddSwaggerGen();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                c.RoutePrefix = "";
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors(configurePolicy => configurePolicy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

        }
    }
}
