import React from "react";
import { Award, Target, Users, Briefcase, Type } from "lucide-react";
import praveer from "../assets/praveer.png";
import trayambak from "../assets/trayambak.png";
import rishabh from "../assets/rishabh.jpg";
import rupesh from "../assets/rupesh.jpg";

const About = () => {
  const team = [
    {
      name: "Rishabh Shrivastav",
      role: "Machine Learning Lead",
      image: rishabh,
      description: "Former Quantitative Researcher at Goldman Sachs",
    },
    {
      name: "Rupesh Kumar",
      role: "Web Developer",
      image: rupesh,
      description: "15 years experience in high-frequency trading systems",
    },
    {
      name: "Praveer",
      role: "Web Developer",
      image: praveer,
      description: "PhD in Financial Mathematics from MIT",
    },
    {
      name: "Harshit Mehta",
      role: "Machine Learning",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      description: "Previously led product at Citadel Securities",
    },
    {
      name: "Trayambak Rai",
      role: "Research & Development",
      image: trayambak,
      description: "10+ years in software development, ex-Google",
    },
    {
      name: "Owais Raza",
      role: "Machine Learning",
      image:
        "https://images.unsplash.com/photo-1562788869-4ed32648eb72?auto=format&fit=crop&q=80&w=200",
      description: "Former hedge fund strategist at Bridgewater Associates",
    },
  ];

  const stats = [
    { icon: <Award />, value: "10+", label: "Years Experience" },
    { icon: <Target />, value: "99.9%", label: "Uptime" },
    { icon: <Users />, value: "50,000+", label: "Active Traders" },
    { icon: <Briefcase />, value: "$2B+", label: "Monthly Volume" },
  ];

  return (
    <div id="about" className="bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            About AlgoTrade
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We're a team of traders, quants, and engineers building the future
            of algorithmic trading.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="text-emerald-400 mb-4 flex justify-center">
                {React.cloneElement(stat.icon, { className: "h-8 w-8" })}
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Leadership Team Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-white mb-12 text-center">
            Our Leadership Team
          </h3>

          {/* First row (4 members) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 px-4">
            {team.slice(0, 4).map((member, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="text-xl font-semibold text-white mb-2">
                  {member.name}
                </h4>
                <p className="text-emerald-400 mb-2">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.description}</p>
              </div>
            ))}
          </div>

          {/* Second row (2 members centered) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
            <div className="hidden md:block"></div>{" "}
            {/* Empty space only on medium+ screens */}
            {team.slice(4, 6).map((member, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="text-xl font-semibold text-white mb-2">
                  {member.name}
                </h4>
                <p className="text-emerald-400 mb-2">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.description}</p>
              </div>
            ))}
            <div className="hidden md:block"></div>{" "}
            {/* Empty space only on medium+ screens */}
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Our Vision</h3>
              <p className="text-gray-400 mb-6">
                We envision a future where sophisticated algorithmic trading
                strategies are accessible to everyone. By combining cutting-edge
                technology with intuitive design, we're breaking down the
                barriers to algorithmic trading and creating opportunities for
                traders worldwide.
              </p>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-emerald-400 rounded-full mr-3"></span>
                  Democratizing access to algorithmic trading
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-emerald-400 rounded-full mr-3"></span>
                  Building institutional-grade tools for all
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-emerald-400 rounded-full mr-3"></span>
                  Fostering a community of algorithmic traders
                </li>
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
                alt="Trading Office"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
