import Image from "next/image";
import Link from "next/link";
// İMPORT YOUR LOGO HERE 
// import Logo from "../../../../public/";

const Sidebar = () => {
  const navigation = [
    { href: "/admin/blog", name: "Blog" },
  ];

  return (
    <>
      <nav className="hidden lg:block fixed top-0 left-0 w-full h-full border-r bg-white space-y-8 sm:w-80">
        <div className="flex flex-col h-full">
                  <div className="h-40 flex items-center px-8">
                      {/* USE YOUR LOGO HERE */}
            {/* <Link
              href=""
              target="_blank"
              className="flex-none">
              <Image
                src={Logo}
                width={140}
                className="mx-auto"
                alt=""
              />
            </Link> */}
          </div>
          <div className="flex-1 flex flex-col h-full overflow-auto">
            <ul className="px-4 text-lg font-medium flex-1">
              {navigation.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    className="flex items-center gap-x-2 text-gray-600 p-2 rounded-lg hover:bg-gray-200 active:bg-gray-100 duration-150">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;