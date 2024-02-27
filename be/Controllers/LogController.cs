using be.Common;
using be.Models;
using be.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace be.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogController : ControllerBase
    {
        private readonly IConfiguration configuration;
        protected readonly ILogger<LogController> logger;

        public LogController(IConfiguration configuration, ILogger<LogController> logger)
        {
            this.configuration = configuration;
            this.logger = logger;
        }
        [HttpPost("LogInfo")]
        public async Task<object> LogInfo([FromBody] LogModel model)
        {
            try
            {
                var log = string.Empty;
                if (!string.IsNullOrEmpty(model.Info))
                    log += " Info: " + model.Info + Environment.NewLine;

                this.logger.Log(LogLevel.Information, log);
                System.Diagnostics.Debug.WriteLine(log);
                return 200;
            }
            catch (Exception ex)
            {
                this.logger.Log(LogLevel.Error, ex, string.Empty);
                Response.StatusCode = (int)ConstantValues.ServicesHttpResponses.InternalServerError.StatusCode;
                return ConstantValues.ServicesHttpResponses.InternalServerError.Result;
            }
        }
        [HttpPost("LogError")]
        public async Task<object> LogError([FromBody] LogModel model)
        {
            try
            {
                var log = string.Empty;
                if (!string.IsNullOrEmpty(model.ErrorName))
                    log += "ErrorName: " + model.ErrorName + Environment.NewLine;
                if (!string.IsNullOrEmpty(model.ErrorMessage))
                    log += " ErrorMessage: " + model.ErrorMessage + Environment.NewLine;
                if (!string.IsNullOrEmpty(model.ErrorStackTrace))
                    log += " ErrorStackTrace: " + model.ErrorStackTrace + Environment.NewLine;
                if (model.Instance != null)
                    log += " Instance: " + model.Instance + Environment.NewLine;
                if (!string.IsNullOrEmpty(model.Info))
                    log += " Info: " + model.Info + Environment.NewLine;
                if (!string.IsNullOrEmpty(model.RequestURL))
                    log += " RequestURL: " + model.RequestURL + Environment.NewLine;
                if (model.ResponseStatus != null)
                    log += " ResponseStatus: " + model.ResponseStatus + Environment.NewLine;
                if (!string.IsNullOrEmpty(model.ResponseResult))
                    log += " ResponseResult: " + model.ResponseResult + Environment.NewLine;

                this.logger.Log(LogLevel.Error, log);
                System.Diagnostics.Debug.WriteLine(log);
                return 200;
            }
            catch (Exception ex)
            {
                this.logger.Log(LogLevel.Error, ex, string.Empty);
                Response.StatusCode = (int)ConstantValues.ServicesHttpResponses.InternalServerError.StatusCode;
                return ConstantValues.ServicesHttpResponses.InternalServerError.Result;
            }
        }
    }
}