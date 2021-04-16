using SmartTutorial.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface IThemeService
    {
        public Task<IList<Theme>> GetAll();
        public Task<Theme> GetWithInclude(int id);
    }
}
