using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using SmartTutorial.API.Infrastucture.Models;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace SmartTutorial.API.Infrastucture.Extensions
{
    public static class QueryableExtensions
    {
        public static async Task<PaginatedResult<TDto>> CreatePaginatedResultAsync<TEntity, TDto>(
            this IQueryable<TEntity> query, PagedRequest pagedRequest, IMapper mapper)
            where TEntity : class
            where TDto : class
        {
            query = query.ApplyFilters(pagedRequest);

            var total = await query.CountAsync();

            query = query.Paginate(pagedRequest);

            var projectionResult = query.ProjectTo<TDto>(mapper.ConfigurationProvider);

            projectionResult = projectionResult.Sort(pagedRequest);

            var listResult = await projectionResult.ToListAsync();

            return new PaginatedResult<TDto>
            {
                Items = listResult,
                PageSize = pagedRequest.PageSize,
                PageIndex = pagedRequest.PageIndex,
                Total = total
            };
        }

        private static IQueryable<T> Paginate<T>(this IQueryable<T> query, PagedRequest pagedRequest)
        {
            var entities = query.Skip(pagedRequest.PageIndex * pagedRequest.PageSize).Take(pagedRequest.PageSize);
            return entities;
        }

        private static IQueryable<T> Sort<T>(this IQueryable<T> query, PagedRequest pagedRequest)
        {
            if (!string.IsNullOrWhiteSpace(pagedRequest.ColumnNameForSorting))
            {
                query = query.OrderBy(pagedRequest.ColumnNameForSorting + " " + pagedRequest.SortDirection);
            }

            return query;
        }

        private static IQueryable<T> ApplyFilters<T>(this IQueryable<T> query, PagedRequest pagedRequest)
        {
            var predicate = new StringBuilder();
            var requestFilters = pagedRequest.RequestFilters;
            for (var i = 0; i < requestFilters.Filters.Count; i++)
            {
                if (i > 0)
                {
                    predicate.Append($" {requestFilters.LogicalOperator} ");
                }


                var path = requestFilters.Filters[i].Path;
                var operation = requestFilters.Filters[i].Operation;

                predicate.Append(path + $" {ParseOperation(operation, i)}");
            }

            if (!requestFilters.Filters.Any())
            {
                return query;
            }

            var propertyValues = requestFilters.Filters.Select(filter => filter.Value).ToArray();

            query = query.Where(predicate.ToString(), propertyValues);

            return query;
        }

        private static string ParseOperation(string operation, int i)
        {
            return operation switch
            {
                "equals" => $" == (@{i})",
                "contains" => $".Contains (@{i})",
                "startsWith" => $".StartsWith (@{i})",
                "endsWith" => $".EndsWith (@{i})",
                "=" => $" == (@{i})",
                "!=" => $" != (@{i})",
                ">" => $" > (@{i})",
                ">=" => $" >= (@{i})",
                "<" => $" < (@{i})",
                "<=" => $" <= (@{i})",
                "is" => $" == (@{i})",
                "not" => $" != (@{i})",
                "after" => $" > (@{i})",
                "onOrAfter" => $" >= (@{i})",
                "before" => $" < (@{i})",
                "onOrBefore" => $" <= (@{i})",
                _ => "=="
            };
        }
    }
}