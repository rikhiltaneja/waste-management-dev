import { HeaderCard } from "./header-card";

type HeroSectionProps = {
  title: string;
  leftSideProp: { label: string; value: string | number };
  rightSideProp: { label: string; value: string | number };
  showHeading?: boolean;
};

export function DashboardHeroSection({
  title,
  leftSideProp,
  rightSideProp,
  showHeading = false,
}: HeroSectionProps) {
  return (
    <>
      {/* Mobile */}
      <section className="sm:hidden relative mb-20">
        <div className="bg-[#1B1B25] rounded-3xl p-6 text-white pb-30">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/profile-avatar.jpg"
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-green-500 object-cover"
            />
            <div>
              <div className="text-lg font-semibold">Welcome Back,</div>
              <div className="text-sm opacity-80">Citizen</div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-12 left-4 right-4">
          <HeaderCard
            title={title}
            leftSideProp={leftSideProp}
            rightSideProp={rightSideProp}
            className="shadow-lg"
          />
        </div>
      </section>
      {/* Desktop */}
      <section className="hidden sm:grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#1B1B25] p-6 lg:p-10 rounded-3xl lg:rounded-4xl">
        <div className="lg:col-span-2 p-6 lg:p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/profile-avatar.jpg"
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-green-500 object-cover"
            />
            <div>
              <div className="text-sm opacity-80">Welcome Back,</div>
              <div className="text-sm opacity-80">Citizen</div>
            </div>
          </div>
          {showHeading && (
            <h1 className="text-2xl lg:text-3xl font-semibold leading-tight">
              Clean future starts<br />
              with smart waste management.
            </h1>
          )}
        </div>
        <HeaderCard
          title={title}
          leftSideProp={leftSideProp}
          rightSideProp={rightSideProp}
        />
      </section>
    </>
  );
}