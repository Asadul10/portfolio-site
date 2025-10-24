'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Download, Award, Code, Shield, Network, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkillMatrix } from '@/components/skill-matrix';
import { Timeline } from '@/components/timeline';
import { siteConfig } from '@/lib/config';

export function AboutSection() {
  const skillCategories = [
    {
      icon: Shield,
      name: 'Cybersecurity',
      skills: siteConfig.skills.Cybersecurity,
      color: 'text-red-600',
    },
    {
      icon: Code,
      name: 'Frontend',
      skills: siteConfig.skills.Frontend,
      color: 'text-blue-600',
    },
    {
      icon: Database,
      name: 'Backend',
      skills: siteConfig.skills.Backend,
      color: 'text-green-600',
    },
    {
      icon: Network,
      name: 'Networking',
      skills: siteConfig.skills.Networking,
      color: 'text-purple-600',
    },
    {
      icon: Award,
      name: 'DevOps',
      skills: siteConfig.skills.DevOps,
      color: 'text-orange-600',
    },
    {
      icon: Database,
      name: 'Data/ML',
      skills: siteConfig.skills['Data/ML'],
      color: 'text-pink-600',
    },
  ];

  return (
    <section className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-16"
        >
          {/* Hero Section */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
                  About Me
                </h1>
                <p className="mt-4 text-xl text-muted-foreground">
                  {siteConfig.tagline}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4 text-muted-foreground"
              >
                <p>
                  I'm a passionate cybersecurity professional and full-stack developer with over 5 years of experience 
                  in building secure, scalable applications and conducting comprehensive security assessments.
                </p>
                <p>
                  My journey began in network security, where I developed a deep understanding of infrastructure 
                  vulnerabilities and defense mechanisms. This foundation led me to full-stack development, where 
                  I combine security-first principles with modern web technologies.
                </p>
                <p>
                  I&apos;m passionate about helping organizations strengthen their security posture through both 
                  proactive development practices and thorough penetration testing.                   When I&apos;m not coding or 
                  conducting security assessments, you&apos;ll find me contributing to open-source projects and
                  sharing knowledge through technical writing.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <Button size="lg" className="group">
                  <Download className="mr-2 h-4 w-4" />
                  Download CV
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/contact">Get In Touch</a>
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square max-w-md mx-auto">
                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-32 w-32 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {siteConfig.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Professional Photo</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Skills Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Technical Skills
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A comprehensive overview of my technical expertise
              </p>
            </div>
            <SkillMatrix skills={siteConfig.skills} />
          </motion.div>

          {/* Experience Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Professional Experience
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                My career journey and key achievements
              </p>
            </div>
            <Timeline items={siteConfig.timeline} />
          </motion.div>

          {/* Certifications & Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Certifications & Achievements
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Professional certifications and notable accomplishments
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Security Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="outline">CISSP</Badge>
                    <Badge variant="outline">CEH</Badge>
                    <Badge variant="outline">OSCP</Badge>
                    <Badge variant="outline">Security+</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-600" />
                    Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="outline">AWS Certified</Badge>
                    <Badge variant="outline">Kubernetes</Badge>
                    <Badge variant="outline">Docker</Badge>
                    <Badge variant="outline">Git Expert</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="outline">Bug Bounty Hunter</Badge>
                    <Badge variant="outline">Open Source Contributor</Badge>
                    <Badge variant="outline">Conference Speaker</Badge>
                    <Badge variant="outline">Technical Writer</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
