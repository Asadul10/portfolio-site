'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { siteConfig } from '@/lib/config';

interface SkillCategoryProps {
  category: string;
  skills: string[];
  index: number;
}

function SkillCategory({ category, skills, index }: SkillCategoryProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="space-y-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400">
        {category}
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {skills.map((skill, skillIndex) => (
          <motion.div
            key={skill}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: (index * 0.1) + (skillIndex * 0.05) 
            }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">{skill}</span>
              <span className="text-xs text-muted-foreground">
                {Math.floor(Math.random() * 30) + 70}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ 
                  width: `${Math.floor(Math.random() * 30) + 70}%` 
                }}
                transition={{ 
                  duration: 1.5, 
                  delay: (index * 0.1) + (skillIndex * 0.1),
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scaleY: 1.2,
                  transition: { duration: 0.2 }
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function SkillsSection() {
  const skillCategories = Object.entries(siteConfig.skills);

  return (
    <section className="section-padding bg-muted/30" data-section="skills">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Technical Skills
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A comprehensive overview of my technical expertise across different domains
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map(([category, skills], index) => (
              <motion.div
                key={category}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300"
              >
                <SkillCategory
                  category={category}
                  skills={skills}
                  index={index}
                />
              </motion.div>
            ))}
          </div>

          {/* Additional skills showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-4">Certifications & Tools</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'CISSP', 'CEH', 'OSCP', 'AWS Security', 'CISCO CCNA',
                'Docker', 'Kubernetes', 'Terraform', 'Git', 'Jenkins',
                'Burp Suite', 'Nmap', 'Wireshark', 'Metasploit', 'OWASP ZAP'
              ].map((cert, index) => (
                <motion.span
                  key={cert}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05 
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors duration-200"
                >
                  {cert}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
