import sys
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_pdf():
    pdf_filename = "Emergency_Patient_Management_System_Viva_Guide.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#0f172a")    # Slate 900
    ACCENT = colors.HexColor("#dc2626")     # Emergency Red
    BLUE_ACCENT = colors.HexColor("#0284c7") # Hospital Blue
    LIGHT_BG = colors.HexColor("#f8fafc")   # Slate 50
    BORDER_COLOR = colors.HexColor("#cbd5e1")

    # Typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=22,
        leading=26,
        textColor=PRIMARY,
        fontName='Helvetica-Bold',
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontSize=11,
        leading=15,
        textColor=ACCENT,
        fontName='Helvetica-Bold',
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading2'],
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        fontName='Helvetica-Bold',
        spaceBefore=12,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading3'],
        fontSize=11,
        leading=15,
        textColor=BLUE_ACCENT,
        fontName='Helvetica-Bold',
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#334155")
    )

    body_bold = ParagraphStyle(
        'Body_Bold',
        parent=body_style,
        fontName='Helvetica-Bold',
        textColor=PRIMARY
    )

    qa_q_style = ParagraphStyle(
        'QA_Question',
        parent=body_style,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor("#b91c1c"),
        fontSize=10,
        leading=14,
        spaceBefore=6
    )

    qa_a_style = ParagraphStyle(
        'QA_Answer',
        parent=body_style,
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=6
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Code'],
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#0f172a"),
        fontName='Courier'
    )

    story = []

    # Title & Header
    story.append(Paragraph("PROJECT 4: EMERGENCY PATIENT MANAGEMENT SYSTEM", title_style))
    story.append(Paragraph("Hospital ED Triage System &bull; DSA Project Report & Comprehensive Viva Preparation Guide", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT, spaceBefore=0, spaceAfter=12))

    # Section 1: Project Overview
    story.append(Paragraph("1. Project Statement & Practical Significance", h1_style))
    intro_text = (
        "<b>What is this system?</b> It simulates a Real-World Hospital Emergency Department (ED). "
        "Unlike a standard Out-Patient Department (OPD) where patients are treated purely on a first-come-first-served basis, "
        "an Emergency Department operates on <b>Clinical Triage</b>: patients in critical, life-threatening conditions "
        "(e.g., Cardiac Arrest, Severe Trauma) <b>must be treated immediately</b> before non-urgent cases (e.g., minor sprain, routine fever), "
        "regardless of who reached the hospital first."
    )
    story.append(Paragraph(intro_text, body_style))
    story.append(Spacer(1, 8))

    # Core Requirements Table
    req_data = [
        [Paragraph("<b>Mandatory Operation</b>", body_bold), Paragraph("<b>How it works</b>", body_bold), Paragraph("<b>Data Structure Used</b>", body_bold)],
        [Paragraph("<b>1. Register Patient</b>", body_style), Paragraph("Accepts ID, Name, Age, Emergency Level (1-5), and Condition. Assigns sequential Arrival #.", body_style), Paragraph("Priority Queue + BST", code_style)],
        [Paragraph("<b>2. Treat Next Patient</b>", body_style), Paragraph("Picks highest emergency level. If tied, picks earliest arrival (FIFO). Adds to history.", body_style), Paragraph("Priority Queue + Linked List", code_style)],
        [Paragraph("<b>3. Search Patient by ID</b>", body_style), Paragraph("Quickly finds patient details, current status (Waiting/Treated), and notes in O(log n).", body_style), Paragraph("Binary Search Tree (BST)", code_style)],
        [Paragraph("<b>4. Display Waiting Patients</b>", body_style), Paragraph("Displays all actively waiting triage patients ordered by priority and arrival sequence.", body_style), Paragraph("Priority Queue (Level Queues)", code_style)],
        [Paragraph("<b>5. Cancel Registration</b>", body_style), Paragraph("Removes patient from waiting line and deletes node from the BST index.", body_style), Paragraph("Queue deletion + BST.delete()", code_style)],
        [Paragraph("<b>6. Display Treated History</b>", body_style), Paragraph("Chronological archive of all treated patients with doctor notes.", body_style), Paragraph("Singly Linked List", code_style)],
    ]
    req_table = Table(req_data, colWidths=[120, 260, 150])
    req_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(req_table)
    story.append(Spacer(1, 14))

    # Section 2: Data Structures Deep Dive
    story.append(Paragraph("2. In-Depth Explanation of the 4 Required Data Structures", h1_style))

    # DS 1: Priority Queue
    story.append(Paragraph("A. Priority Queue (For Emergency Triage)", h2_style))
    pq_desc = (
        "<b>Role:</b> Manages waiting patients sorted primarily by Emergency Level (5 down to 1).<br/>"
        "<b>Implementation Architecture:</b> In our system, the Priority Queue is built using a <b>Multi-Level Bucket Strategy</b> "
        "consisting of 5 separate FIFO Queues (one for each emergency tier).<br/>"
        "&bull; <i>Why this design?</i> Standard binary heaps can be unstable regarding arrival sequence (FIFO tie-breaking). "
        "By mapping each priority level (5 down to 1) to its own dedicated FIFO Queue, extraction sweeps from Level 5 to 1 in O(1) level lookup, "
        "and guaranteed FIFO ordering is naturally preserved with zero key comparison overhead!"
    )
    story.append(Paragraph(pq_desc, body_style))
    story.append(Spacer(1, 8))

    # DS 2: FIFO Queue
    story.append(Paragraph("B. FIFO Queue (Same-Priority Tie Breaker)", h2_style))
    q_desc = (
        "<b>Role:</b> When two patients arrive with the same emergency level (e.g., both Level 4), the rule states: "
        "<i>'The patient who arrived earlier should be treated first.'</i><br/>"
        "<b>Implementation:</b> Custom linked queue with <code>head</code> and <code>tail</code> pointers.<br/>"
        "&bull; <code>enqueue(patient)</code>: Inserts at tail in O(1).<br/>"
        "&bull; <code>dequeue()</code>: Removes from head in O(1)."
    )
    story.append(Paragraph(q_desc, body_style))
    story.append(Spacer(1, 8))

    # DS 3: BST
    story.append(Paragraph("C. Binary Search Tree (O(log n) Patient Lookup & Cancellation)", h2_style))
    bst_desc = (
        "<b>Role:</b> Enables rapid searching and registration cancellation by Patient ID (e.g., 'P-101', 'P-102').<br/>"
        "<b>Implementation:</b> Each tree node holds a Patient object, a <code>left</code> pointer, and a <code>right</code> pointer.<br/>"
        "&bull; <code>search(id)</code>: Compares target ID with current node. If smaller, goes left; if larger, goes right. Average complexity: <b>O(log n)</b>.<br/>"
        "&bull; <code>delete(id)</code>: Handles 3 classic BST cases: Leaf node, Single-child node, and Two-children node (replaces with in-order successor).<br/>"
        "&bull; <code>inOrderTraversal()</code>: Left &rarr; Root &rarr; Right prints all indexed patients in sorted order."
    )
    story.append(Paragraph(bst_desc, body_style))
    story.append(Spacer(1, 8))

    # DS 4: Linked List
    story.append(Paragraph("D. Singly Linked List (Treated History Archive)", h2_style))
    ll_desc = (
        "<b>Role:</b> Retains the historical treatment logs and physician notes.<br/>"
        "<b>Implementation:</b> <code>LinkedListNode&lt;T&gt;</code> with <code>next</code> pointer.<br/>"
        "&bull; <code>prepend(item)</code>: Inserts newly treated patient directly at the head in <b>O(1)</b> time, ensuring the most recently treated patient always appears at the top of the history list."
    )
    story.append(Paragraph(ll_desc, body_style))
    story.append(Spacer(1, 14))

    # Time Complexity Table
    story.append(Paragraph("Summary of Time & Space Complexities", h2_style))
    complexities = [
        [Paragraph("<b>Operation</b>", body_bold), Paragraph("<b>Data Structure</b>", body_bold), Paragraph("<b>Time Complexity</b>", body_bold), Paragraph("<b>Space Complexity</b>", body_bold)],
        [Paragraph("Register Patient", body_style), Paragraph("Priority Queue + BST", body_style), Paragraph("O(log n) BST + O(1) Queue", code_style), Paragraph("O(1) per node", body_style)],
        [Paragraph("Treat Next Patient", body_style), Paragraph("PQ extract + LL prepend", body_style), Paragraph("O(1) extraction + O(1) prepend", code_style), Paragraph("O(1)", body_style)],
        [Paragraph("Search Patient by ID", body_style), Paragraph("Binary Search Tree", body_style), Paragraph("O(log n) average, O(n) worst", code_style), Paragraph("O(h) recursion stack", body_style)],
        [Paragraph("Cancel Registration", body_style), Paragraph("Queue remove + BST delete", body_style), Paragraph("O(k) queue search + O(log n) BST", code_style), Paragraph("O(1)", body_style)],
        [Paragraph("Treated History Display", body_style), Paragraph("Linked List Traversal", body_style), Paragraph("O(m) where m = treated patients", code_style), Paragraph("O(m)", body_style)],
    ]
    comp_table = Table(complexities, colWidths=[130, 150, 150, 100])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(comp_table)

    story.append(PageBreak())

    # Section 3: Viva Questions & Perfect Answers
    story.append(Paragraph("3. Top Viva Questions & Model Answers for Project Evaluation", h1_style))
    story.append(Paragraph("Prepare these exact questions—examiners frequently ask these for Project 4:", body_style))
    story.append(Spacer(1, 6))

    viva_qa = [
        (
            "Q1: Why did you not just use a simple Array with Array.sort() instead of custom Data Structures?",
            "Answer: An array sort takes O(n log n) every time a new patient arrives, which is inefficient. Furthermore, the problem specifically mandates fundamental data structures. We implemented custom Priority Queue, Queue, BST, and Linked List classes from scratch with explicit pointer references to demonstrate algorithmic mastery."
        ),
        (
            "Q2: How do you handle tie-breaking when two patients have the same emergency level?",
            "Answer: We use a multi-level priority queue where each priority level (1 to 5) has its own FIFO Queue. When two patients share the same level (e.g., Level 4), they are placed into that level's FIFO Queue. The one who arrived first is closer to the queue's head and is extracted first in O(1) time."
        ),
        (
            "Q3: Why is a Binary Search Tree (BST) used for searching instead of searching the Priority Queue?",
            "Answer: Priority Queues are optimized for extracting the minimum or maximum element (Root), not for searching arbitrary keys (which takes O(n) linear scanning). A BST organizes patient records by Patient ID, allowing O(log n) average-time search, quick status lookup, and efficient node deletion upon cancellation."
        ),
        (
            "Q4: What happens during patient cancellation in both data structures?",
            "Answer: Cancellation performs two synchronized steps: First, it removes the patient from the Priority Queue's level queue. Second, it calls BST.delete(patientId), which removes the node while maintaining BST properties (handling leaf nodes, single child, or finding in-order successor for two children)."
        ),
        (
            "Q5: Why is a Linked List chosen for the treated patient history?",
            "Answer: The history continuously grows with each treated patient. A Linked List supports dynamic memory allocation without fixed-size array resizing overhead. New treated records are prepended at the head in O(1) constant time, making the most recent treatments immediately accessible."
        ),
        (
            "Q6: What is the worst-case time complexity of BST search, and how can it be prevented?",
            "Answer: If patient IDs are inserted in strictly sorted ascending or descending order, an unbalanced BST degenerates into a skewed tree (like a linked list) with O(n) search time. This can be prevented using Self-Balancing BSTs such as AVL Trees or Red-Black Trees which enforce O(log n) worst-case balance."
        ),
        (
            "Q7: Is this only a frontend prototype, or does it run real DSA logic?",
            "Answer: It executes 100% genuine algorithmic logic written in TypeScript. Every enqueue, dequeue, tree traversal, pointer update, and linked node prepend happens in real memory inside our EmergencyDepartmentController. The UI only reflects the state of these underlying data structures."
        )
    ]

    for q, a in viva_qa:
        story.append(Paragraph(q, qa_q_style))
        story.append(Paragraph(a, qa_a_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 10))

    # Section 4: Live Demo Flow for Examiner
    story.append(Paragraph("4. Recommended 2-Minute Live Demo Flow for External Examiner", h1_style))
    demo_steps = (
        "<b>Step 1: Show Initial Triage Queue</b><br/>"
        "Point to the pre-seeded patients. Explain that patients with Level 5 (Resuscitation) are automatically staged at the top.<br/><br/>"
        "<b>Step 2: Demonstrate Priority Override</b><br/>"
        "Register a new patient with <b>Level 2 (Less Urgent)</b>. Note that they appear near the bottom. "
        "Then register a new patient with <b>Level 5 (Critical)</b>. Show how the Level 5 patient immediately jumps to the front of the 'Next Patient for Treatment' desk.<br/><br/>"
        "<b>Step 3: Demonstrate Treat Patient & Linked List Prepending</b><br/>"
        "Click <b>'Treat Patient Now'</b>. Show how the patient is dequeued from the Priority Queue and immediately appears as the newest #1 node in the <b>'Treated History (Linked List)'</b> tab.<br/><br/>"
        "<b>Step 4: Demonstrate BST Search & Traversal</b><br/>"
        "Go to the <b>'BST Patient Search'</b> tab. Enter an ID like <code>P-101</code>. Show the instant O(log n) lookup. Show the In-Order Traversal buttons at the bottom that demonstrate lexicographical BST ordering.<br/><br/>"
        "<b>Step 5: Show Real-Time Operation Logs</b><br/>"
        "Switch to the <b>'DSA Data Structure Visualizer'</b> tab to reveal real-time execution logs showing exact function calls (<code>PriorityQueue.insert()</code>, <code>BST.search()</code>, <code>LinkedList.prepend()</code>)."
    )
    story.append(Paragraph(demo_steps, body_style))
    story.append(Spacer(1, 12))

    # Footer note
    story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor("#94a3b8"), spaceBefore=8, spaceAfter=8))
    story.append(Paragraph("<b>Submission Ready</b> &bull; St. Jude Emergency Department Management System &bull; Project 4 &bull; Next.js + TypeScript + Tailwind CSS", ParagraphStyle('FooterStyle', parent=body_style, fontSize=8, textColor=colors.HexColor("#64748b"), alignment=1)))

    doc.build(story)
    print("PDF generated successfully:", pdf_filename)

if __name__ == '__main__':
    generate_pdf()
