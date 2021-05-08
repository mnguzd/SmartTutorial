using System.Collections.Generic;
using System.Threading.Tasks;
using SmartTutorial.Domain;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface IThemeService
    {
        Task<IList<Theme>> GetAll();
        Task<Theme> GetWithInclude(int id);
    }
}