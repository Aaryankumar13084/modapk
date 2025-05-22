import { Link } from "wouter";
import { 
  RiTelegramLine, 
  RiTwitterLine, 
  RiDiscordLine, 
  RiRedditLine 
} from "@/lib/icons";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">About</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">About Us</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">DMCA</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Help & Support</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">FAQ</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Report APK</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Request APK</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Connect</h3>
              <ul className="mt-4 flex space-x-5">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <RiTelegramLine className="h-6 w-6" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <RiTwitterLine className="h-6 w-6" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <RiDiscordLine className="h-6 w-6" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <RiRedditLine className="h-6 w-6" />
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">Join our community for updates and support.</p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 text-center">&copy; {new Date().getFullYear()} ModAPK Hub. All rights reserved.</p>
            <p className="text-xs text-gray-400 text-center mt-2">Disclaimer: We do not host or develop any applications. All APKs are provided by users and are for personal use only.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
