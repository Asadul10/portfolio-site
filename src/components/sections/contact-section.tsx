'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactForm } from '@/components/contact-form';
import { siteConfig } from '@/lib/config';

export function ContactSection() {
  return (
    <section className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div className="text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Get In Touch
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              I'm always interested in new opportunities and collaborations
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Send me a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and I'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    You can also reach me through these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a
                        href={siteConfig.links.email}
                        className="text-sm text-muted-foreground hover:text-primary-600"
                      >
                        {siteConfig.social.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Github className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium">GitHub</p>
                      <a
                        href={siteConfig.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary-600"
                      >
                        github.com/{siteConfig.social.github}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Linkedin className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <a
                        href={siteConfig.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary-600"
                      >
                        linkedin.com/in/{siteConfig.social.linkedin}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What I'm Looking For</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary-600 mt-2 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Cybersecurity consulting and penetration testing projects
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary-600 mt-2 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Full-stack web development opportunities
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary-600 mt-2 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Open source contributions and collaborations
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary-600 mt-2 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Speaking opportunities and technical writing
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
