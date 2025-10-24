'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SkillCategory } from '@/types';

interface SkillMatrixProps {
  skills: Record<string, readonly string[]>;
}

export function SkillMatrix({ skills }: SkillMatrixProps) {
  const skillCategories = Object.entries(skills).map(([name, skillList]) => ({
    name,
    skills: skillList,
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {skillCategories.map((category, index) => (
        <motion.div
          key={category.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <CardDescription>
                {category.skills.length} skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
