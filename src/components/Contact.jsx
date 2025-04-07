import React from 'react';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

const Contact = React.forwardRef((props, ref) => {
  return (
    <section 
      ref={ref}
      id="contact" 
      className="bg-gray-900 py-20 scroll-mt-16"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Contact Us</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get in touch with our team for support or business inquiries
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="bg-gray-800 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-emerald-400 mr-4 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Email</h4>
                    <p className="text-gray-400">algotrade@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-emerald-400 mr-4 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Phone</h4>
                    <p className="text-gray-400">+91 9334810701</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-emerald-400 mr-4 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Location</h4>
                    <p className="text-gray-400">
                    Kalinga Institute of Industrial Technology (KIIT)<br/>
                    Patia, Bhubaneswar, Odisha, India<br/>
                    Pin: 751024<br />
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MessageSquare className="h-6 w-6 text-emerald-400 mr-4 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Live Chat (<i>Coming Soon</i>)</h4>
                    <p className="text-gray-400">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Office Hours</h3>
              <div className="space-y-4 text-gray-400">
                <p>Monday - Friday: 9:00 AM - 8:00 PM IST</p>
                <p>Saturday: 10:00 AM - 4:00 PM IST</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-400 mb-2">Name</label>
                <input
                  id="name"
                  type="text"
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-gray-400 mb-2">Subject</label>
                <input
                  id="subject"
                  type="text"
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="How can we help?"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-400 mb-2">Message</label>
                <textarea
                  id="message"
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 h-32"
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Contact;