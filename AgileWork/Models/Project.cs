﻿using System;

namespace AgileWork.Models 
{
    public class Project 
    {
        public string Uid { get; set; }
        public string Name { get; set; }
        public string IdUserCreated { get; set; }
        public string UserCreatedEmail { get; set; }
        public string Description { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public Project() {}

        public Project(string uid, string name, string idUserCreated, string userCreatedEmail, string description, string startDate, string endDate) 
        {
            Uid = uid ?? throw new ArgumentNullException(nameof(uid));
            Name = name ?? throw new ArgumentNullException(nameof(name));
            IdUserCreated = idUserCreated ?? throw new ArgumentNullException(nameof(idUserCreated));
            UserCreatedEmail = userCreatedEmail ?? throw new ArgumentNullException(nameof(userCreatedEmail));
            Description = description ?? throw new ArgumentNullException(nameof(description));
            StartDate = startDate ?? throw new ArgumentNullException(nameof(startDate));
            EndDate = endDate ?? throw new ArgumentNullException(nameof(endDate));
        }

        public override string ToString() 
        {
            return $"{nameof(Uid)}: {Uid}, {nameof(Name)}: {Name}, {nameof(IdUserCreated)}: {IdUserCreated}, {nameof(UserCreatedEmail)}: {UserCreatedEmail}, {nameof(Description)}: {Description}, {nameof(StartDate)}: {StartDate}, {nameof(EndDate)}: {EndDate}";
        }
    }
}