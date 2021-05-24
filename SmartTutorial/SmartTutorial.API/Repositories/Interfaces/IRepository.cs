using SmartTutorial.API.Infrastucture.Models;
using SmartTutorial.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace SmartTutorial.API.Repositories.Interfaces
{
    public interface IRepository
    {
        Task<TEntity> GetById<TEntity>(int id) where TEntity : BaseEntity;

        Task<TEntity> GetByIdWithInclude<TEntity>(int id, params Expression<Func<TEntity, object>>[] includeProperties) where TEntity : BaseEntity;

        Task<List<TEntity>> GetAll<TEntity>() where TEntity : BaseEntity;

        IQueryable<TEntity> Get<TEntity>() where TEntity : BaseEntity;

        Task<bool> SaveAll();

        Task<TEntity> Add<TEntity>(TEntity entity,bool saveNow) where TEntity : BaseEntity;

        TEntity Update<TEntity>(TEntity entity) where TEntity : BaseEntity;

        Task<TEntity> Delete<TEntity>(int id) where TEntity : BaseEntity;

        Task<PaginatedResult<TDto>> GetPagedData<TEntity, TDto>(PagedRequest pagedRequest) where TEntity : class
            where TDto : class;
    }
}
