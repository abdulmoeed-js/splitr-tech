
import { 
  User, 
  Bell, 
  Lock, 
  List
} from "lucide-react";
import { CurrencySelector } from "./CurrencySelector";
import { useCurrency } from "@/hooks/useCurrency";

export const AccountSettingsTab = () => {
  const { currencyPreference, updateCurrencyPreference } = useCurrency();

  const settingsCategories = [
    {
      title: "General",
      items: [
        { icon: <List size={18} />, label: "Categories", value: "8 Categories", link: "#" },
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
          <h3 className="text-sm font-medium text-gray-400">{category.title}</h3>
          <div className="space-y-2">
            {category.items.map((item, itemIndex) => (
              <a 
                key={itemIndex} 
                href={item.link} 
                className="flex items-center justify-between p-3 glass-card"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700/70 flex items-center justify-center text-purple-400">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  {item.value && <span className="mr-1">{item.value}</span>}
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      {/* Currency Settings */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-400">Currency</h3>
        <div className="glass-card p-3">
          <CurrencySelector 
            currentCurrency={currencyPreference.currency} 
            onCurrencyChange={updateCurrencyPreference}
          />
        </div>
      </div>
    </div>
  );
};
