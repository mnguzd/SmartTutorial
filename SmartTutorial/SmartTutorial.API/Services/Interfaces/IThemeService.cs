using SmartTutorial.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface IThemeService
    {
         Task<IList<Theme>> GetAll();
         Task<Theme> GetWithInclude(int id);
    }
}
