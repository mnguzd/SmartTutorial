using SmartTutorial.API.Dtos.ThemeDtos;
using SmartTutorial.API.Infrastucture.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface IThemeService
    {
        Task<IList<ThemeDto>> GetAll();
        Task<ThemeDto> GetWithInclude(int id);
        Task<PaginatedResult<ThemeDto>> GetPaginated(PagedRequest request);
    }
}