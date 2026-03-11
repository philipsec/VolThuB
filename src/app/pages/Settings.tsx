import { Settings as SettingsIcon } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

export default function Settings() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#071022] mb-2">Settings</h1>
        <p className="text-lg text-[#9CA3AF]">Configure your application preferences</p>
      </div>

      <Card className="bg-white border-[#D1D5DB]">
        <CardContent className="p-16 text-center">
          <SettingsIcon className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#071022] mb-2">Settings Coming Soon</h3>
          <p className="text-[#9CA3AF]">
            Additional settings and preferences will be available here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
