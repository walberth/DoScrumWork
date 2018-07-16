using System;

namespace AgileWork.Models 
{
    public class UserTask 
    {
        public string Uid { get; set; }
        public string Name { get; set; }
        public string IdUserHistories { get; set; }
        public string State { get; set; }

        public UserTask() {}

        public UserTask(string uid, string name, string idUserHistories, string state) 
        {
            Uid = uid ?? throw new ArgumentNullException(nameof(uid));
            Name = name ?? throw new ArgumentNullException(nameof(name));
            IdUserHistories = idUserHistories ?? throw new ArgumentNullException(nameof(idUserHistories));
            State = state ?? throw new ArgumentNullException(nameof(state));
        }

        public override string ToString() 
        {
            return $"{nameof(Uid)}: {Uid}, {nameof(Name)}: {Name}, {nameof(IdUserHistories)}: {IdUserHistories}, {nameof(State)}: {State}";
        }
    }
}