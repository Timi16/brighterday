import React, { ReactNode } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

// Sample content for tips
type TipContentMap = {
  [key: string]: { content: string }
};

const tipContents: TipContentMap = {
  '1': {
    content: `# Creating Visual Schedules

Visual schedules are powerful tools for children with autism to understand daily routines and transitions. They provide structure, reduce anxiety, and promote independence.

## Benefits
- Increases predictability
- Reduces anxiety about transitions
- Builds independence
- Improves understanding of time concepts

## How to Create an Effective Visual Schedule

### 1. Choose the Right Format
Consider your child's age and comprehension level. Options include:
- Photo schedules with real pictures
- Picture symbol schedules (like PECS)
- Written schedules for children who can read
- Object schedules for very concrete learners

### 2. Select Essential Activities
Include:
- Daily routines (brushing teeth, getting dressed)
- Transitions between activities
- Special events or changes to routine
- Beginning and end of day activities

### 3. Be Consistent
- Place the schedule in the same location
- Review it at consistent times
- Follow through with the activities shown
- Update it consistently

### 4. Teach Schedule Use
- Demonstrate how to use the schedule
- Practice following it together
- Gradually reduce prompting
- Celebrate successes

Remember that every child is unique, and you may need to adjust your approach. Be patient as your child learns this new skill!`,
  },
  '2': {
    content: `# Managing Mealtime Challenges

Mealtimes can be particularly challenging for families with children on the autism spectrum. Many children with autism have sensory sensitivities, food preferences, and behavioral patterns that can make meals stressful.

## Common Challenges

### Sensory Sensitivities
Many children with autism experience sensory issues related to food:
- Texture sensitivities (crunchy, smooth, mixed textures)
- Temperature preferences (only very hot or cold foods)
- Color aversions (refusing foods of certain colors)
- Smell sensitivities (strong food odors can be overwhelming)

### Routine and Sameness
- Insistence on the same foods at every meal
- Distress when preferred foods are unavailable
- Difficulty with new foods or brands

### Environmental Factors
- Noisy or busy mealtimes can increase anxiety
- Lighting, seating, and utensils can all impact comfort

## Effective Strategies

### Gradual Exposure to New Foods
- Start with very small portions of new foods
- Place new foods on the plate without pressure to eat
- Use preferred foods as a bridge to new foods
- Celebrate any interaction with new foods, even if just touching or smelling

### Create a Predictable Routine
- Serve meals at consistent times
- Use visual schedules to show mealtime routines
- Provide clear expectations about behavior

### Modify the Environment
- Reduce distractions during mealtimes
- Consider lighting and noise levels
- Use preferred seating arrangements
- Offer adaptive utensils if needed

### Make It Fun
- Use food play in non-mealtime settings to explore foods
- Try food-related activities like gardening or cooking
- Use special interests to encourage trying new foods

Remember that progress may be slow. Celebrate small victories and stay consistent with your approach.`,
  },
  '3': {
    content: `# Understanding Tantrum Triggers

Tantrums and meltdowns can be challenging for both children with autism and their caregivers. Understanding the triggers can help prevent these difficult situations.

## Common Triggers

### Sensory Overload
- Loud noises or crowded spaces
- Bright or flickering lights
- Uncomfortable clothing or textures
- Strong smells or tastes

### Communication Frustrations
- Difficulty expressing needs or wants
- Not being understood by others
- Struggling to understand instructions

### Changes in Routine
- Unexpected schedule changes
- Transitions between activities
- New environments or people

### Physical Discomfort
- Hunger or thirst
- Fatigue or lack of sleep
- Illness or pain

## Prevention Strategies

### Identify Early Warning Signs
- Increased stimming behaviors
- Changes in facial expression or tone of voice
- Physical signs like flushed face or tense muscles
- Verbal cues like repetitive questioning

### Create a Calming Plan
- Designate a quiet space for breaks
- Prepare a "calm down kit" with sensory tools
- Teach and practice calming techniques during calm times
- Use visual supports to communicate feelings

### Modify the Environment
- Reduce known sensory triggers when possible
- Provide noise-canceling headphones in loud settings
- Offer fidget tools for stressful situations
- Create predictable routines with visual schedules

### Teach Communication Skills
- Use visual supports to help express feelings
- Teach alternative ways to communicate needs
- Practice asking for breaks or help
- Acknowledge and validate feelings

Remember that tantrums are often a form of communication. With patience and consistency, you can help your child develop better coping strategies.`,
  },
  '4': {
    content: `# Bedtime Routine Builder

Establishing a consistent and calming bedtime routine can help children with autism transition to sleep more easily. This guide will help you create a customized routine that works for your family.

## Benefits of a Consistent Bedtime Routine
- Reduces anxiety about bedtime
- Helps signal the body to prepare for sleep
- Creates a calming transition from day to night
- Builds independence in self-care skills

## Creating Your Routine

### 1. Choose a Consistent Bedtime
- Consider your child's natural sleep patterns
- Aim for 9-11 hours of sleep for school-age children
- Try to keep weekday and weekend times within 30-60 minutes

### 2. Select Calming Activities
Choose 4-6 activities from these categories:
- **Hygiene:** Bath/shower, brushing teeth, washing face
- **Comfort:** Changing into pajamas, comfort item/toy
- **Calming:** Reading a story, quiet music, guided relaxation
- **Connection:** Special time, gentle backrub, saying goodnight

### 3. Consider Sensory Needs
- **Light:** Dim lights gradually, use night lights if needed
- **Sound:** White noise, soft music, or complete quiet
- **Touch:** Weighted blankets, specific pajama textures
- **Movement:** Gentle rocking, deep pressure, or stretching

### 4. Create Visual Supports
- Make a visual schedule showing each step
- Use photographs, symbols, or words based on your child's level
- Include time estimates if helpful

### 5. Be Consistent
- Follow the same steps in the same order
- Keep the routine to 20-30 minutes total
- Start at the same time each night
- Use the same verbal cues and prompts

### 6. Troubleshooting Common Issues
- **Difficulty settling:** Try adding a weighted blanket or deep pressure
- **Bedtime resistance:** Ensure daytime schedule provides enough activity
- **Waking during night:** Consider sensory factors that might disturb sleep
- **Early waking:** Evaluate bedroom for early morning light or noise

Remember that establishing a new routine takes time. Be patient and consistent, and adjust as needed to find what works best for your child.`,
  },
  '5': {
    content: `# Self-Care for Parents

Caring for a child with autism can be deeply rewarding but also demanding. Taking care of yourself isn't selfish—it's essential for being the best parent you can be.

## Why Self-Care Matters
- Prevents burnout and compassion fatigue
- Models healthy coping for your child
- Improves patience and emotional regulation
- Strengthens your ability to problem-solve

## Quick Self-Care Practices

### Physical Well-being (5-10 minutes)
- Take a brisk walk around the block
- Do a quick yoga stretch routine
- Practice deep breathing exercises
- Dance to a favorite upbeat song
- Take a power nap (set a timer for 20 minutes)

### Emotional Well-being (5-10 minutes)
- Journal three things you're grateful for
- Call a supportive friend
- Practice mindfulness meditation
- Look at photos that bring you joy
- Listen to music that lifts your mood

### Mental Well-being (5-10 minutes)
- Read a few pages of a book for pleasure
- Do a crossword or sudoku puzzle
- Step outside and notice nature details
- Create something small (sketch, poem, etc.)
- Listen to an interesting podcast

## Building Support Systems
- Connect with other parents who understand
- Join a support group (in-person or online)
- Accept help when it's offered
- Be specific when asking for help
- Consider respite care options

## Overcoming Guilt
- Remember that self-care benefits your child
- Start with small, achievable self-care moments
- Schedule self-care as you would any important appointment
- Notice improvements in your patience and mood

Remember that self-care isn't one-size-fits-all. Find what genuinely refreshes and restores you, and make it a non-negotiable part of your routine.`,
  },
  '6': {
    content: `# Healthy Snack Ideas

Finding nutritious snacks that appeal to children with autism can be challenging. These autism-friendly options consider common sensory preferences while providing good nutrition.

## Crunchy Snacks
- Apple slices with nut or seed butter
- Vegetable sticks with hummus
- Roasted chickpeas (try different seasonings)
- Whole grain crackers with cheese
- Rice cakes with favorite toppings
- Air-popped popcorn with minimal seasoning

## Smooth Snacks
- Yogurt with honey (for children over 1 year)
- Smoothies with hidden vegetables
- Applesauce with cinnamon
- Pudding made with avocado and cocoa
- Pureed fruit leather (homemade to control sugar)

## Protein-Rich Snacks
- Hard-boiled eggs (if texture is accepted)
- Cheese sticks or cubes
- Turkey or chicken roll-ups
- Edamame beans (if no soy allergies)
- Mini meatballs (can be made with preferred flavors)

## Sweet Snacks (Lower Sugar)
- Frozen banana slices
- Berries with a small amount of whipped cream
- Oat energy balls with dates and nut butter
- Dark chocolate-dipped strawberries
- Homemade popsicles from fruit and yogurt

## Tips for Success
- Maintain consistent appearance of foods
- Introduce new foods alongside preferred foods
- Use cookie cutters for fun shapes
- Create a visual menu of acceptable snacks
- Allow your child to help prepare snacks when possible
- Serve foods separately rather than mixed together

Remember that food preferences can change over time. Continue offering varied options in a pressure-free way to expand your child's diet gradually.`,
  },
  '7': {
    content: `# Transition Strategies

Transitions between activities or environments can be particularly challenging for children with autism. These strategies can help make daily transitions smoother and less stressful.

## Why Transitions Are Challenging
- Difficulty shifting attention
- Anxiety about what comes next
- Sensory changes between environments
- Attachment to current activity
- Processing delays in understanding expectations

## Visual Transition Supports

### Visual Schedules
- First-Then boards for simple transitions
- Daily visual schedules showing all transitions
- Mini-schedules for multi-step activities
- Visual countdown systems

### Visual Timers
- Time timers that show time elapsing visually
- Visual countdown strips (removing items as time passes)
- Sand timers for shorter transitions
- Digital timers with visual elements

## Verbal Transition Supports

### Predictable Cues
- Consistent verbal warnings (5-minute, 2-minute notices)
- Simple, clear language about what's ending and what's next
- Positive framing of upcoming activities
- Consistent transition phrases or songs

### Social Stories
- Create simple stories about common transitions
- Read transition stories regularly, not just before difficult transitions
- Include photos of your child in the transition stories
- Focus on successful outcomes and coping strategies

## Environmental Strategies

### Transition Objects
- Comfort items that move between environments
- Fidget tools specifically for transition times
- Photo cards of the next location/activity to hold
- Transition backpacks with comforting items

### Sensory Considerations
- Allow noise-canceling headphones during transitions
- Consider sunglasses for outdoor transitions
- Use deep pressure techniques before challenging transitions
- Create sensory-friendly pathways between activities

Remember that consistency is key. Use the same transition cues and supports regularly so your child learns to recognize and respond to them.`,
  },
};

// Badge component (reused from tips.tsx)
const Badge = ({ type }: { type: string }) => {
  let backgroundColor: string;
  let label: string;
  
  switch (type) {
    case 'expert':
      backgroundColor = Colors.common.teal;
      label = 'ABA Verified';
      break;
    case 'favorite':
      backgroundColor = '#FFDB58';
      label = 'Parent Favorite';
      break;
    case 'quick':
      backgroundColor = '#73C2FB';
      label = 'Quick Read';
      break;
    case 'new':
      backgroundColor = '#C39BD3';
      label = 'New';
      break;
    default:
      backgroundColor = '#E1E1E1';
      label = type;
  }

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <ThemedText style={styles.badgeText}>{label}</ThemedText>
    </View>
  );
};

// Main component
export default function TipDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const tipId = params.id as string;
  const title = params.title as string;
  const imageUrl = params.imageUrl as string;
  const summary = params.summary as string;
  const badges = (params.badges as string || '').split(',');
  
  // Convert markdown to display format
  const renderMarkdownSection = (text: string) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    const renderedContent: React.ReactElement[] = [];
    
    lines.forEach((line, index) => {
      if (line.startsWith('# ')) {
        renderedContent.push(
          <ThemedText key={`h1-${index}`} style={styles.heading1}>
            {line.substring(2)}
          </ThemedText>
        );
      } else if (line.startsWith('## ')) {
        renderedContent.push(
          <ThemedText key={`h2-${index}`} style={styles.heading2}>
            {line.substring(3)}
          </ThemedText>
        );
      } else if (line.startsWith('### ')) {
        renderedContent.push(
          <ThemedText key={`h3-${index}`} style={styles.heading3}>
            {line.substring(4)}
          </ThemedText>
        );
      } else if (line.startsWith('- ')) {
        renderedContent.push(
          <View key={`li-${index}`} style={styles.listItemContainer}>
            <View style={styles.bulletPoint} />
            <ThemedText style={styles.listItem}>
              {line.substring(2)}
            </ThemedText>
          </View>
        );
      } else if (line.trim() === '') {
        renderedContent.push(<View key={`space-${index}`} style={styles.paragraphSpace} />);
      } else {
        renderedContent.push(
          <ThemedText key={`p-${index}`} style={styles.paragraph}>
            {line}
          </ThemedText>
        );
      }
    });
    
    return renderedContent;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.headerImage}
            contentFit="cover"
            transition={200}
          />
        )}
        
        <View style={styles.content}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.summary}>{summary}</ThemedText>
          
          <View style={styles.badgeContainer}>
            {badges.map((badge, index) => (
              <Badge key={`badge-${index}`} type={badge} />
            ))}
          </View>
          
          <View style={styles.contentDivider} />
          
          {tipId && tipContents.hasOwnProperty(tipId) ? (
            renderMarkdownSection(tipContents[tipId as keyof typeof tipContents].content)
          ) : (
            <ThemedText style={styles.paragraph}>
              Detailed content for this tip will be coming soon! Check back later for updates.
            </ThemedText>
          )}
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.back();
        }}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  summary: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555555',
    marginBottom: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contentDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginVertical: 20,
  },
  heading1: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    marginTop: 24,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    marginTop: 20,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
    marginTop: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444444',
    marginBottom: 12,
  },
  paragraphSpace: {
    height: 12,
  },
  listItemContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.common.teal,
    marginRight: 8,
    marginTop: 8,
  },
  listItem: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#444444',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});
