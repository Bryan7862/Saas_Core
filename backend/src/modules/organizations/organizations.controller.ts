import { Controller } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';

@Controller('admin/organizations')
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) { }
    // No endpoints yet, mainly used by AuthModule. Future: Get My Orgs
}
