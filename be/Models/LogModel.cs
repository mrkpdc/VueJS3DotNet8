namespace be.Models
{
    public class LogModel
    {
        public string? ErrorName { get; set; }
        public string? ErrorMessage { get; set; }
        public string? ErrorStackTrace { get; set; }
        public object? Instance { get; set; }
        public string? Info { get; set; }
        public string? RequestURL { get; set; }
        public string? ResponseResult { get; set; }
        public int? ResponseStatus { get; set; }
    }
}