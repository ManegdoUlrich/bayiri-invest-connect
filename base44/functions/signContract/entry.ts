import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { project_id, signature_data } = await req.json();
    if (!project_id || !signature_data) {
      return Response.json({ error: 'project_id and signature_data are required' }, { status: 400 });
    }

    // Get real IP from headers
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      req.headers.get('cf-connecting-ip') ||
      'IP inconnue';

    const signDate = new Date().toISOString();

    // Fetch project to verify ownership
    const projects = await base44.entities.Project.filter({ id: project_id });
    const project = projects[0];
    if (!project) return Response.json({ error: 'Project not found' }, { status: 404 });
    if (project.client_email !== user.email) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (project.signature_status === 'signe') {
      return Response.json({ error: 'Already signed' }, { status: 400 });
    }

    await base44.entities.Project.update(project_id, {
      signature_status: 'signe',
      signature_date: signDate,
      signature_data: signature_data,
      signature_ip: ip,
    });

    // Send confirmation notification
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: user.email,
      subject: `Confirmation de signature — ${project.title}`,
      body: `Bonjour ${user.full_name || ''},\n\nVous avez signé électroniquement le contrat du projet « ${project.title} ».\n\n📅 Date : ${new Date(signDate).toLocaleString('fr-FR')}\n🌐 IP : ${ip}\n\nCette signature est juridiquement valable conformément à la réglementation sur la signature électronique.\n\nCordialement,\nL'équipe Bayiri Invest`,
    });

    return Response.json({ success: true, signature_date: signDate, signature_ip: ip });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});