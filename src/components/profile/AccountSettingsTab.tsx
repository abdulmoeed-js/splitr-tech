
import { 
  User, 
  Bell, 
  Lock, 
  DollarSign, 
  CreditCard, 
  ChevronRight
} from "lucide-react";

export const AccountSettingsTab = () => {
  const settingsCategories = [
    {
      title: "General",
      items: [
        { icon: <User size={18} />, label: "Categories", value: "8 Categories", link: "#" },
        { icon: <DollarSign size={18} />, label: "Account Currency", value: "USD", link: "#" },
      ]
    },
    {
      title: "Account",
      items: [
        { icon: <User size={18} />, label: "My Account", value: "", link: "#" },
        { icon: <Bell size={18} />, label: "Notifications", value: "", link: "#" },
        { icon: <Lock size={18} />, label: "Privacy", value: "", link: "#" },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {settingsCategories.map((category, index) => (
        <div key={index} className="space-y-2">
          <h3 className="text-sm text-primary/70">{category.title}</h3>
          <div className="space-y-2">
            {category.items.map((item, itemIndex) => (
              <a 
                key={itemIndex} 
                href={item.link} 
                className="flex items-center justify-between p-3 bg-accent/10 rounded-lg hover:bg-accent/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-primary">
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center text-primary/70">
                  {item.value && <span className="mr-1">{item.value}</span>}
                  <ChevronRight size={16} />
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
