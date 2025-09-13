import { SettingsQuickLinks } from "@/components/settings/QuickLinkSettings";
import { Card } from "@/components/ui/Card";
import { SearchParamsProps } from "@/types";

const SystemSettingPage = async (_props: SearchParamsProps) => {
  return (
    <div className="p-6 flex flex-col lg:flex-row w-full min-h-screen gap-10">
      <div className="w-full lg:w-[70%] flex flex-col gap-4">
        <Card className="shadow-none rounded-xl">
          <p className="text-gray-500 text-center py-6">
            No content available.
          </p>
        </Card>
      </div>
      <div className="w-full space-y-6">
        <SettingsQuickLinks />
      </div>
    </div>
  );
};

export default SystemSettingPage;
