﻿namespace Services.Utils
{
    public class Response<T>
    {
        public bool IsSuccess { get; set; }
        
        public string Message { get; set; }
        
        public T Data { get; set; }
    }
}