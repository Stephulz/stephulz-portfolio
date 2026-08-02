import { TECH_ICONS } from './tech-icons';
import { PROJECTS } from '../models/project.model';
import { EXPERIENCES } from '../models/experience.model';

const iconNames = Object.keys(TECH_ICONS);

describe('Tech data consistency', () => {
  it('every project technology should have an icon in TECH_ICONS', () => {
    for (const project of PROJECTS) {
      for (const tech of project.technologies) {
        expect(iconNames).toContain(tech);
      }
    }
  });

  it('every experience technology should have an icon in TECH_ICONS', () => {
    for (const exp of EXPERIENCES) {
      for (const tech of exp.technologies) {
        expect(iconNames).toContain(tech);
      }
    }
  });

  it('every TECH_ICONS entry should map to a non-empty icon name', () => {
    for (const [tech, icon] of Object.entries(TECH_ICONS)) {
      expect(tech.trim().length).toBeGreaterThan(0);
      expect(icon.trim().length).toBeGreaterThan(0);
    }
  });
});
