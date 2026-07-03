import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
  values = [
    {
      icon: 'fas fa-leaf',
      title: '100% Organic',
      description: 'All our products are certified organic and sustainably sourced from local farmers.'
    },
    {
      icon: 'fas fa-hand-holding-heart',
      title: 'Community First',
      description: 'We support local farming communities and ensure fair trade practices.'
    },
    {
      icon: 'fas fa-recycle',
      title: 'Eco-Friendly',
      description: 'Committed to reducing waste with sustainable packaging and delivery methods.'
    },
    {
      icon: 'fas fa-seedling',
      title: 'Farm to Table',
      description: 'Direct from farmers to your doorstep, ensuring freshness and quality.'
    },
    {
      icon: 'fas fa-heart',
      title: 'Customer Focus',
      description: 'Your satisfaction and health are our top priorities in everything we do.'
    },
    {
      icon: 'fas fa-globe',
      title: 'Global Impact',
      description: 'Working towards a healthier planet through sustainable agriculture.'
    }
  ];

  team = [
    {
      name: 'Sarah Johnson',
      position: 'Founder & CEO',
      bio: 'Passionate about organic farming with 15 years of experience in sustainable agriculture.',
      image: 'assets/team/sarah.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        twitter: 'https://twitter.com/sarahjohnson'
      }
    },
    {
      name: 'Michael Chen',
      position: 'Head of Operations',
      bio: 'Expert in supply chain management ensuring fresh deliveries to your doorstep.',
      image: 'assets/team/michael.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/michaelchen'
      }
    },
    {
      name: 'Emma Rodriguez',
      position: 'Quality Control Manager',
      bio: 'Certified organic inspector ensuring all products meet strict quality standards.',
      image: 'assets/team/emma.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/emmarodriguez'
      }
    },
    {
      name: 'David Omondi',
      position: 'Community Relations',
      bio: 'Building strong relationships with local farmers and communities.',
      image: 'assets/team/david.jpg',
      social: {
        twitter: 'https://twitter.com/davidomondi'
      }
    }
  ];

  testimonials = [
    {
      name: 'Jennifer Lawrence',
      avatar: 'assets/testimonials/jennifer.jpg',
      rating: 5,
      text: 'The quality of produce is amazing! I love knowing exactly where my food comes from.'
    },
    {
      name: 'Robert Martinez',
      avatar: 'assets/testimonials/robert.jpg',
      rating: 5,
      text: 'Excellent service and the freshest organic vegetables I\'ve ever had. Highly recommended!'
    },
    {
      name: 'Priya Patel',
      avatar: 'assets/testimonials/priya.jpg',
      rating: 4,
      text: 'Great selection of organic products. The delivery is always on time and well packaged.'
    },
    {
      name: 'James Wilson',
      avatar: 'assets/testimonials/james.jpg',
      rating: 5,
      text: 'Finally a reliable source for organic produce. The subscription service is very convenient.'
    }
  ];

  milestones = [
    { year: 2015, event: 'GreenMarket founded with 5 local farmers' },
    { year: 2017, event: 'Expanded to 50+ farmers and first delivery service' },
    { year: 2019, event: 'Launched online marketplace and mobile app' },
    { year: 2021, event: 'Reached 10,000 happy customers milestone' },
    { year: 2023, event: 'Expanded to 8 major cities nationwide' }
  ];

  stats = {
    farmers: 100,
    customers: 50000,
    cities: 8,
    products: 500,
    deliveries: 100000,
    satisfaction: 98
  };

  partners = [
    { name: 'Organic Farmers Association', logo: 'assets/partners/ofa.png' },
    { name: 'Sustainable Agriculture Network', logo: 'assets/partners/san.png' },
    { name: 'Local Harvest', logo: 'assets/partners/local-harvest.png' },
    { name: 'Green Business Bureau', logo: 'assets/partners/gbb.png' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Animate stats counting
    this.animateStats();
  }

  animateStats(): void {
    // This would be implemented with animation logic
    // For now, we'll just log
    console.log('Stats animation triggered');
  }

  getYearsInBusiness(): number {
    const startYear = 2015;
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
  }

  calculateImpact(): any {
    return {
      co2Saved: '500 tons',
      plasticReduced: '10,000 kg',
      farmersSupported: 100,
      acresOrganic: 5000
    };
  }

  joinNewsletter(email: string): void {
    console.log('Newsletter signup:', email);
    // Implement newsletter signup logic
  }

  scheduleTour(): void {
    console.log('Farm tour scheduled');
    // Implement tour scheduling
  }
}