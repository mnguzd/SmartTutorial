using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SmartTutorial.API.Dtos.PaginationDtos.ThemesDtos;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;

namespace SmartTutorial.API.Services.Implementations
{
    public class ThemeService : IThemeService
    {
        private readonly IGenericRepository<Theme> _repository;

        public ThemeService(IGenericRepository<Theme> repository)
        {
            _repository = repository;
        }

        public async Task<IList<Theme>> GetAll()
        {
            return await _repository.GetAll();
        }

        public async Task<Theme> GetWithInclude(int id)
        {
            return await _repository.GetByIdWithInclude(id, x => x.Subjects);
        }

        public async Task<IList<Theme>> GetPaginated(ThemeParameters parameters)
        {
            var result = await _repository.GetAll();
            return result.OrderBy(x => x.Id).Skip((parameters.PageNumber - 1) * parameters.PageSize)
                .Take(parameters.PageSize).ToList();
        }
    }
}