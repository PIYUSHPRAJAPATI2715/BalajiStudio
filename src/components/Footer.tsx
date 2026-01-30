import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-zinc-950 text-white pt-16 pb-8 border-t border-white/10" id="contact">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-4 font-heading">Balaji Events & Photo Studio</h3>
                        <p className="text-gray-400 mb-6">
                            Capturing moments that last a lifetime. Specialized in wedding photography, pre-wedding shoots, and cinematic films.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary hover:text-black transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary hover:text-black transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary hover:text-black transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-xl font-bold mb-6 font-heading">Contact Us</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <p className="text-gray-400">Niwaru, Jhotwara, Jaipur, Rajasthan</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="w-6 h-6 text-primary flex-shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-gray-400">Vishnu Prajapati: +91 78917 66624</span>
                                    <span className="text-gray-400">Manoj Prajapati: +91 97821 30139</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail className="w-6 h-6 text-primary flex-shrink-0" />
                                <p className="text-gray-400">contact@balajistudio.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Map/Area */}
                    <div>
                        <h4 className="text-xl font-bold mb-6 font-heading">Location</h4>
                        <div className="w-full h-48 bg-zinc-900 rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Placeholder for map iframe or image */}
                            <div className="w-full h-full flex items-center justify-center bg-white/5">
                                <span className="text-gray-500 flex items-center gap-2"><MapPin /> Jaipur, Rajasthan</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Balaji Events & Photo Studio. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
