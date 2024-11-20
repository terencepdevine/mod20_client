import IconDiscord from "./icons/IconDiscord";
import IconTwitch from "./icons/IconTwitch";
import IconYoutube from "./icons/IconYoutube";
import IconInstagram from "./icons/IconInstagram";

function SocialNavigation() {
  const social = [
    {
      icon: (
        <IconDiscord className="h-4 w-auto fill-sky-500 lg:h-5 lg:fill-gray-300" />
      ),
      url: "https://discord.com",
    },
    {
      icon: (
        <IconTwitch className="h-4 w-auto fill-sky-500 lg:h-5 lg:fill-gray-300" />
      ),
      url: "https://twitch.tv",
    },
    {
      icon: (
        <IconYoutube className="h-4 w-auto fill-sky-500 lg:h-5 lg:fill-gray-300" />
      ),
      url: "https://youtube.com",
    },
    {
      icon: (
        <IconInstagram className="h-4 w-auto fill-sky-500 lg:h-5 lg:fill-gray-300" />
      ),
      url: "https://instagram.com",
    },
  ];

  return (
    <nav>
      <ul className="flex items-center gap-6">
        {social.map(function (item, i) {
          return (
            <SocialNavigationItem icon={item.icon} url={item.url} key={i} />
          );
        })}
      </ul>
    </nav>
  );
}

type SocialNavigationItemProps = {
  icon: React.ReactNode;
  url: string;
};

const SocialNavigationItem: React.FC<SocialNavigationItemProps> = ({
  icon,
  url,
}) => {
  return (
    <li>
      <a href={url}>{icon}</a>
    </li>
  );
};

export default SocialNavigation;
