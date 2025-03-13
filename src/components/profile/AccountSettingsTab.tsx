
import { 
  User, 
  Bell, 
  Lock, 
  CreditCard, 
  ChevronRight
} from "lucide-react";
import { CurrencySelector } from "./CurrencySelector";
import { useCurrency } from "@/hooks/useCurrency";

export const AccountSettingsTab = () => {
  const { currencyPreference, updateCurrencyPreference } = useCurrency();

  const settingsCategories = [
    {
      title: "General",
      items: [
        { icon: <User size={18} />, label: "Categories", value: "8 Categories", link: "#" },
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
          <h3 className="text-sm text-gray-500">{category.title}</h3>
          <div className="space-y-2">
            {category.items.map((item, itemIndex) => (
              <a 
                key={itemIndex} 
                href={item.link} 
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-yellow-500">
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  {item.value && <span className="mr-1">{item.value}</span>}
                  <ChevronRight size={16} />
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      {/* Currency Settings */}
      <div className="space-y-2">
        <h3 className="text-sm text-gray-500">Currency</h3>
        <CurrencySelector 
          currentCurrency={currencyPreference.currency} 
          onCurrencyChange={updateCurrencyPreference}
        />
      </div>
    </div>
  );
};
